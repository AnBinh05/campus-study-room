export type BuildingType = 'A' | 'B' | 'C' | 'V';

export type AmenityType = 'projector' | 'whiteboard' | 'high_spec_pc' | 'air_conditioner';

export type CapacityCategory = 'ALL' | 'small' | 'medium' | 'large';

export interface Room {
  id: string;
  name: string;
  code: string;
  building: BuildingType;
  floor: number;
  capacity: number;
  capacityCategory: 'small' | 'medium' | 'large';
  amenities: AmenityType[];
  imageUrl: string;
  description: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  period: 'morning' | 'afternoon' | 'evening';
  sessionName: string;
}

export type BookingStatus = 'active' | 'checked_in' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingCode: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  building: BuildingType;
  floor: number;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  userId: string;
  userName: string;
  studentId: string;
  userEmail: string;
  purpose: string;
  attendeesCount: number;
  status: BookingStatus;
  createdAt: string;
  notificationId?: string;
  qrPayload: string;
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  avatar: string;
  role: 'student' | 'lecturer';
}

export interface FilterState {
  searchQuery: string;
  building: 'ALL' | BuildingType;
  capacityFilter: CapacityCategory;
  amenities: AmenityType[];
  selectedDate: string;
}
