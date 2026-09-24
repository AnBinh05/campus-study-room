import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import {
  Room,
  Booking,
  User,
  FilterState,
  TimeSlot,
  BuildingType,
  CapacityCategory,
  AmenityType,
} from '../types';
import { INITIAL_ROOMS, INITIAL_USER, getInitialBookings } from '../constants/mockData';
import { NotificationService } from '../services/notificationService';
import { firebaseAdapter } from '../services/firebaseConfig';

interface BookingStoreState {
  // Data
  rooms: Room[];
  bookings: Booking[];
  user: User;
  favorites: string[]; // room IDs
  filter: FilterState;
  
  // Active UI Selection
  selectedRoom: Room | null;
  activeBookingModal: boolean;
  activeQRCodeModal: Booking | null;

  // Actions
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  setSelectedDate: (date: string) => void;
  setSelectedRoom: (room: Room | null) => void;
  setActiveBookingModal: (open: boolean) => void;
  setActiveQRCodeModal: (booking: Booking | null) => void;
  toggleFavorite: (roomId: string) => void;
  updateUserProfile: (user: Partial<User>) => void;

  // Booking Operations
  createBooking: (params: {
    room: Room;
    date: string;
    timeSlot: TimeSlot;
    purpose: string;
    attendeesCount: number;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;

  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  checkInBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  mergeRemoteBookings: (remoteBookings: Booking[]) => void;

  // Query & Conflict checks
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  getBookedSlotsForDate: (roomId: string, date: string) => string[];
  getUserActiveBookings: () => Booking[];
  getUserHistoryBookings: () => Booking[];
  getFilteredRooms: () => Room[];
  isRoomAvailableNow: (roomId: string) => boolean;
}

const defaultFilter: FilterState = {
  searchQuery: '',
  building: 'ALL',
  capacityFilter: 'ALL',
  amenities: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
};

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      rooms: INITIAL_ROOMS,
      bookings: getInitialBookings(),
      user: INITIAL_USER,
      favorites: ['room_a_204', 'room_v_101'],
      filter: defaultFilter,
      selectedRoom: null,
      activeBookingModal: false,
      activeQRCodeModal: null,

      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },

      resetFilter: () => {
        set((state) => ({
          filter: {
            ...defaultFilter,
            selectedDate: state.filter.selectedDate, // keep selected date
          },
        }));
      },

      setSelectedDate: (date: string) => {
        set((state) => ({
          filter: { ...state.filter, selectedDate: date },
        }));
      },

      setSelectedRoom: (room: Room | null) => {
        set({ selectedRoom: room });
      },

      setActiveBookingModal: (open: boolean) => {
        set({ activeBookingModal: open });
      },

      setActiveQRCodeModal: (booking: Booking | null) => {
        set({ activeQRCodeModal: booking });
      },

      toggleFavorite: (roomId: string) => {
        set((state) => {
          const exists = state.favorites.includes(roomId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== roomId)
              : [...state.favorites, roomId],
          };
        });
      },

      updateUserProfile: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: { ...state.user, ...updatedUser },
        }));
      },

      /**
       * Merge remote Firestore bookings with local Zustand store
       */
      mergeRemoteBookings: (remoteBookings: Booking[]) => {
        if (!remoteBookings || remoteBookings.length === 0) return;
        set((state) => {
          const existingMap = new Map(state.bookings.map((b) => [b.id, b]));
          remoteBookings.forEach((remoteB) => {
            existingMap.set(remoteB.id, remoteB);
          });
          const merged = Array.from(existingMap.values()).sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          return { bookings: merged };
        });
      },

      /**
       * Checks whether a given slot is already booked for a specific room and date
       */
      isSlotBooked: (roomId: string, date: string, slotId: string): boolean => {
        const { bookings } = get();
        return bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.timeSlot.id === slotId &&
            (b.status === 'active' || b.status === 'checked_in')
        );
      },

      /**
       * Returns all booked slot IDs for a room on a given date
       */
      getBookedSlotsForDate: (roomId: string, date: string): string[] => {
        const { bookings } = get();
        return bookings
          .filter(
            (b) =>
              b.roomId === roomId &&
              b.date === date &&
              (b.status === 'active' || b.status === 'checked_in')
          )
          .map((b) => b.timeSlot.id);
      },

      /**
       * Determines if the room is currently free in the present time slot
       */
      isRoomAvailableNow: (roomId: string): boolean => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

        const { bookings } = get();
        const currentActiveBooking = bookings.find((b) => {
          if (b.roomId !== roomId || b.date !== today) return false;
          if (b.status === 'cancelled' || b.status === 'completed') return false;
          return (
            currentTimeStr >= b.timeSlot.startTime &&
            currentTimeStr <= b.timeSlot.endTime
          );
        });

        return !currentActiveBooking;
      },

      /**
       * Create a new booking with conflict validation, unique code generation and scheduled notification
       */
      createBooking: async ({ room, date, timeSlot, purpose, attendeesCount }) => {
        const { isSlotBooked, user, bookings } = get();

        // 1. Conflict Prevention Check
        if (isSlotBooked(room.id, date, timeSlot.id)) {
          return {
            success: false,
            error: `Khung giờ ${timeSlot.label} ngày ${date} của phòng ${room.code} đã có người đặt trước! Vui lòng chọn ca khác.`,
          };
        }

        // 2. Generate Unique Booking Code (e.g., BK-A201-8392)
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const cleanRoomCode = room.code.replace('.', '');
        const bookingCode = `BK-${cleanRoomCode}-${randomDigits}`;

        // 3. Create QR Payload
        const qrPayload = JSON.stringify({
          code: bookingCode,
          roomId: room.id,
          roomCode: room.code,
          building: room.building,
          floor: room.floor,
          date,
          slot: timeSlot.label,
          studentId: user.studentId,
          studentName: user.name,
          timestamp: new Date().toISOString(),
        });

        // 4. Create new Booking Record
        const newBooking: Booking = {
          id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          bookingCode,
          roomId: room.id,
          roomName: room.name,
          roomCode: room.code,
          building: room.building,
          floor: room.floor,
          date,
          timeSlot,
          userId: user.id,
          userName: user.name,
          studentId: user.studentId,
          userEmail: user.email,
          purpose: purpose || 'Tự học & Thảo luận nhóm',
          attendeesCount: attendeesCount || 2,
          status: 'active',
          createdAt: new Date().toISOString(),
          qrPayload,
        };

        // 5. Schedule 15-minute before Check-in Notification
        try {
          const notifId = await NotificationService.scheduleBookingReminder(newBooking);
          newBooking.notificationId = notifId;
        } catch (err) {
          console.warn('Notification scheduling fallback:', err);
        }

        // 6. Sync with Cloud / Firebase Firestore
        await firebaseAdapter.syncBookingToCloud(newBooking);

        // 7. Update Store State
        set({
          bookings: [newBooking, ...bookings],
          activeBookingModal: false,
        });

        return { success: true, booking: newBooking };
      },

      /**
       * Cancel an active booking and release the slot immediately
       */
      cancelBooking: async (bookingId: string) => {
        const { bookings } = get();
        const targetBooking = bookings.find((b) => b.id === bookingId);

        if (!targetBooking) {
          return { success: false, error: 'Không tìm thấy thông tin đặt phòng!' };
        }

        // Cancel scheduled notification
        if (targetBooking.notificationId) {
          await NotificationService.cancelBookingReminder(targetBooking.notificationId);
        }

        // Sync cancellation to Firebase Cloud Firestore
        await firebaseAdapter.updateBookingStatusInCloud(bookingId, 'cancelled');

        // Update booking status in local Zustand store
        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
        );

        set({ bookings: updatedBookings });
        return { success: true };
      },

      /**
       * Perform QR Code Check-in
       */
      checkInBooking: async (bookingId: string) => {
        const { bookings } = get();

        // Sync check-in to Firebase Cloud Firestore
        await firebaseAdapter.updateBookingStatusInCloud(bookingId, 'checked_in');

        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
        );

        set({ bookings: updatedBookings });
        return { success: true };
      },

      /**
       * Get current user's active/checked-in bookings
       */
      getUserActiveBookings: () => {
        const { bookings, user } = get();
        return bookings.filter(
          (b) =>
            b.userId === user.id &&
            (b.status === 'active' || b.status === 'checked_in')
        );
      },

      /**
       * Get current user's past/cancelled bookings
       */
      getUserHistoryBookings: () => {
        const { bookings, user } = get();
        return bookings.filter(
          (b) =>
            b.userId === user.id &&
            (b.status === 'completed' || b.status === 'cancelled')
        );
      },

      /**
       * Filter rooms based on search, building, capacity category and amenities
       */
      getFilteredRooms: () => {
        const { rooms, filter } = get();
        const { searchQuery, building, capacityFilter, amenities } = filter;

        return rooms.filter((room) => {
          // 1. Search Query (name, code, description)
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const matchesName = room.name.toLowerCase().includes(query);
            const matchesCode = room.code.toLowerCase().includes(query);
            const matchesBuilding = `tòa ${room.building.toLowerCase()}`.includes(query);
            if (!matchesName && !matchesCode && !matchesBuilding) return false;
          }

          // 2. Building Filter
          if (building !== 'ALL' && room.building !== building) {
            return false;
          }

          // 3. Capacity Filter
          if (capacityFilter !== 'ALL' && room.capacityCategory !== capacityFilter) {
            return false;
          }

          // 4. Amenities Filter (must contain all selected amenities)
          if (amenities.length > 0) {
            const hasAllAmenities = amenities.every((amenity) =>
              room.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
          }

          return true;
        });
      },
    }),
    {
      name: 'campus_room_booking_storage_v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        favorites: state.favorites,
        user: state.user,
      }),
    }
  )
);
