/**
 * Firebase / Cloud Storage Adapter
 * Connects directly to Google Cloud Firestore for real-time synchronization
 * of room bookings, status changes (check-in, cancellation), and room metadata.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { Booking, BookingStatus, Room } from '../types';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDkhyjsX61oKBv1RawmH1PBNkQH-AuwT4c",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "campus-study-room.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "campus-study-room",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "campus-study-room.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "653392130240",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:653392130240:web:b748e9273b297cdf7f3d25",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6G3MX5GP93",
};

// Initialize Firebase App singleton
let app: any = null;
let db: Firestore | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  console.log('🔥 [Firebase] Initialized successfully with project:', firebaseConfig.projectId);
} catch (error) {
  console.warn('⚠️ [Firebase] Initialization fallback:', error);
}

export interface FirebaseSyncAdapter {
  isConfigured: boolean;
  db: Firestore | null;
  syncBookingToCloud: (bookingData: Booking) => Promise<boolean>;
  updateBookingStatusInCloud: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  fetchRemoteBookings: () => Promise<Booking[]>;
  subscribeToRemoteBookings: (callback: (bookings: Booking[]) => void) => () => void;
  syncRoomsToCloud: (rooms: Room[]) => Promise<{ success: boolean; error?: string }>;
}

export const firebaseAdapter: FirebaseSyncAdapter = {
  isConfigured: true,
  db,

  /**
   * Sync a new booking or overwrite to Firestore collection 'bookings'
   */
  async syncBookingToCloud(bookingData: Booking): Promise<boolean> {
    if (!db) {
      console.warn('[FirebaseAdapter] Firestore is not initialized.');
      return false;
    }
    try {
      const docRef = doc(db, 'bookings', bookingData.id);
      await setDoc(docRef, bookingData, { merge: true });
      console.log('✅ [Firebase] Booking synced to Cloud Firestore:', bookingData.bookingCode);
      return true;
    } catch (e) {
      console.warn('⚠️ [Firebase] Cloud sync fallback to local storage:', e);
      return false;
    }
  },

  /**
   * Update status of a booking (active, checked_in, completed, cancelled)
   */
  async updateBookingStatusInCloud(bookingId: string, status: BookingStatus): Promise<boolean> {
    if (!db) return false;
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
      console.log(`✅ [Firebase] Booking ${bookingId} status updated to: ${status}`);
      return true;
    } catch (e) {
      console.warn('⚠️ [Firebase] Cloud status update fallback:', e);
      return false;
    }
  },

  /**
   * One-time fetch of all bookings stored in Firestore
   */
  async fetchRemoteBookings(): Promise<Booking[]> {
    if (!db) return [];
    try {
      const bookingsCol = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsCol);
      const list: Booking[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Booking);
      });
      return list;
    } catch (e) {
      console.warn('⚠️ [Firebase] Fetch remote bookings error:', e);
      return [];
    }
  },

  /**
   * Realtime Listener for real-time multi-device sync
   */
  subscribeToRemoteBookings(callback: (bookings: Booking[]) => void): () => void {
    if (!db) return () => {};
    try {
      const bookingsCol = collection(db, 'bookings');
      const unsubscribe: Unsubscribe = onSnapshot(
        bookingsCol,
        (snapshot) => {
          const remoteBookings: Booking[] = [];
          snapshot.forEach((docSnap) => {
            remoteBookings.push(docSnap.data() as Booking);
          });
          callback(remoteBookings);
        },
        (error) => {
          console.warn('⚠️ [Firebase] Bookings snapshot listener warning:', error.message);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('⚠️ [Firebase] Listener subscribe error:', e);
      return () => {};
    }
  },

  /**
   * Sync rooms metadata to Firestore collection 'rooms'
   */
  async syncRoomsToCloud(rooms: Room[]): Promise<{ success: boolean; error?: string }> {
    if (!db) return { success: false, error: 'Database Firestore chưa được khởi tạo.' };
    try {
      for (const room of rooms) {
        const docRef = doc(db, 'rooms', room.id);
        await setDoc(docRef, room, { merge: true });
      }
      console.log(`✅ [Firebase] Successfully synced ${rooms.length} rooms to Cloud Firestore.`);
      return { success: true };
    } catch (e: any) {
      console.warn('⚠️ [Firebase] Sync rooms error:', e);
      const isPermissionDenied = e?.code === 'permission-denied' || String(e).includes('PERMISSION_DENIED');
      const errorMsg = isPermissionDenied
        ? 'Lỗi quyền truy cập (Permission Denied): Bạn cần mở tab "Rules" trên Firebase Console và đổi thành "allow read, write: if true;" rồi bấm Publish.'
        : (e?.message || 'Không thể kết nối tới Firebase.');
      return { success: false, error: errorMsg };
    }
  },
};
