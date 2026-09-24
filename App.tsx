import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { COLORS, RADIUS, SHADOWS, SPACING } from './src/constants/theme';
import { Room, Booking } from './src/types';
import { useBookingStore } from './src/store/useBookingStore';
import { NotificationService } from './src/services/notificationService';
import { firebaseAdapter } from './src/services/firebaseConfig';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { RoomDetailScreen } from './src/screens/RoomDetailScreen';
import { MyBookingsScreen } from './src/screens/MyBookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { QRCodeCheckInModal } from './src/components/QRCodeCheckInModal';
import {
  Compass,
  BookmarkCheck,
  User,
  Sparkles,
} from 'lucide-react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEF2F2' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#991B1B', marginBottom: 12 }}>
            ⚠️ Đã xảy ra lỗi khi hiển thị giao diện:
          </Text>
          <Text style={{ fontSize: 13, color: '#B91C1C', textAlign: 'center', marginBottom: 16 }}>
            {this.state.error?.message || String(this.state.error)}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#DC2626', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Tải lại ứng dụng</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

type TabType = 'explore' | 'bookings' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const activeQRCodeModal = useBookingStore((state) => state.activeQRCodeModal);
  const setActiveQRCodeModal = useBookingStore((state) => state.setActiveQRCodeModal);
  const bookings = useBookingStore((state) => state.bookings);
  const user = useBookingStore((state) => state.user);
  const mergeRemoteBookings = useBookingStore((state) => state.mergeRemoteBookings);

  const activeBookingsCount = React.useMemo(() => {
    return bookings.filter(
      (b) =>
        b.userId === user.id &&
        (b.status === 'active' || b.status === 'checked_in')
    ).length;
  }, [bookings, user.id]);

  useEffect(() => {
    // Request notification permissions on app mount
    NotificationService.requestPermissions();

    // Subscribe to real-time Firebase Firestore Bookings
    const unsubscribe = firebaseAdapter.subscribeToRemoteBookings((remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        mergeRemoteBookings(remoteBookings);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [mergeRemoteBookings]);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBackToExplore = () => {
    setSelectedRoom(null);
  };

  const handleOpenQR = (booking: Booking) => {
    setActiveQRCodeModal(booking);
  };

  const handleCloseQR = () => {
    setActiveQRCodeModal(null);
  };

  const handleTabChange = (tab: TabType) => {
    // If switching to explore tab, reset room detail back to list
    if (tab === 'explore' && activeTab === 'explore') {
      setSelectedRoom(null);
    }
    setActiveTab(tab);
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="dark" />
        
        {/* Main Content Area */}
        <View style={styles.content}>
          {activeTab === 'explore' && (
            selectedRoom ? (
              <RoomDetailScreen
                room={selectedRoom}
                onBack={handleBackToExplore}
              />
            ) : (
              <ExploreScreen
                onSelectRoom={handleSelectRoom}
                onOpenNotifications={() => setActiveTab('bookings')}
              />
            )
          )}

          {activeTab === 'bookings' && (
            <MyBookingsScreen
              onOpenQR={handleOpenQR}
              onNavigateToExplore={() => {
                setSelectedRoom(null);
                setActiveTab('explore');
              }}
            />
          )}

          {activeTab === 'profile' && <ProfileScreen />}
        </View>

        {/* Modern Bottom Navigation Bar */}
        {!selectedRoom && (
          <View style={styles.bottomNav}>
            {/* Tab 1: Explore */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('explore')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  activeTab === 'explore' && styles.iconWrapperActive,
                ]}
              >
                <Compass
                  size={20}
                  color={activeTab === 'explore' ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'explore' && styles.navLabelActive,
                ]}
              >
                Khám phá
              </Text>
            </TouchableOpacity>

            {/* Tab 2: My Bookings */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('bookings')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  activeTab === 'bookings' && styles.iconWrapperActive,
                ]}
              >
                <BookmarkCheck
                  size={20}
                  color={activeTab === 'bookings' ? COLORS.primary : COLORS.textSecondary}
                />
                {activeBookingsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeBookingsCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'bookings' && styles.navLabelActive,
                ]}
              >
                Lịch đặt ({activeBookingsCount})
              </Text>
            </TouchableOpacity>

            {/* Tab 3: Profile */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabChange('profile')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  activeTab === 'profile' && styles.iconWrapperActive,
                ]}
              >
                <User
                  size={20}
                  color={activeTab === 'profile' ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'profile' && styles.navLabelActive,
                ]}
              >
                Cá nhân
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Global Interactive QR Code Modal */}
        <QRCodeCheckInModal
          booking={activeQRCodeModal}
          onClose={handleCloseQR}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    ...(Platform.OS === 'web' ? { height: '100vh' as any, maxHeight: '100vh' as any } : {}),
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.xs,
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.xs,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 40,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: COLORS.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.textLight,
    fontSize: 9,
    fontWeight: '900',
  },
});
