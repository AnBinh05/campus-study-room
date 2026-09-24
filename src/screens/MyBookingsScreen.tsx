import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Booking } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { ActiveBookingCard } from '../components/ActiveBookingCard';
import {
  CalendarDays,
  History,
  BookmarkCheck,
  Search,
  Sparkles,
  Inbox,
  AlertCircle,
} from 'lucide-react-native';

interface MyBookingsScreenProps {
  onOpenQR: (booking: Booking) => void;
  onNavigateToExplore: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  onOpenQR,
  onNavigateToExplore,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const user = useBookingStore((state) => state.user);
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const activeBookings = React.useMemo(() => {
    return bookings.filter(
      (b) =>
        b.userId === user.id &&
        (b.status === 'active' || b.status === 'checked_in')
    );
  }, [bookings, user.id]);

  const historyBookings = React.useMemo(() => {
    return bookings.filter(
      (b) =>
        b.userId === user.id &&
        (b.status === 'completed' || b.status === 'cancelled')
    );
  }, [bookings, user.id]);

  const displayedList = activeTab === 'active' ? activeBookings : historyBookings;

  return (
    <View style={styles.container}>
      {/* Screen Title Header */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.screenTitle}>Lịch Đặt Của Tôi</Text>
          <Text style={styles.screenSub}>
            Quản lý vé phòng học, mã QR check-in & lịch sử
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{activeBookings.length} ca sắp tới</Text>
        </View>
      </View>

      {/* Segmented Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <BookmarkCheck
            size={16}
            color={activeTab === 'active' ? COLORS.primary : COLORS.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Đang hoạt động ({activeBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <History
            size={16}
            color={activeTab === 'history' ? COLORS.primary : COLORS.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.tabTextActive,
            ]}
          >
            Lịch sử ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'active' && activeBookings.length > 0 && (
          <View style={styles.quickTipBanner}>
            <AlertCircle size={15} color={COLORS.primary} />
            <Text style={styles.quickTipText}>
              Nhấp <Text style={{ fontWeight: '700' }}>"Mở mã QR Check-in"</Text> để quét mở khóa tại cửa phòng.
            </Text>
          </View>
        )}

        {displayedList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Inbox size={52} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'Bạn chưa có ca học nào sắp tới'
                : 'Chưa có lịch sử đặt phòng nào'}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'active'
                ? 'Hãy khám phá các phòng học hiện đại tại các tòa A, B, C, V và chọn ca phù hợp nhé!'
                : 'Các ca học đã hoàn tất hoặc đã hủy sẽ hiển thị tại đây.'}
            </Text>

            {activeTab === 'active' && (
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={onNavigateToExplore}
                activeOpacity={0.8}
              >
                <Search size={16} color={COLORS.textLight} style={{ marginRight: 6 }} />
                <Text style={styles.exploreBtnText}>Khám phá & Đặt phòng ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayedList.map((booking) => (
            <ActiveBookingCard
              key={booking.id}
              booking={booking}
              onOpenQR={onOpenQR}
              onCancel={cancelBooking}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 20 : SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  screenSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  countBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingBottom: 40,
  },
  quickTipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    gap: 8,
  },
  quickTipText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primaryDark,
    lineHeight: 17,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    maxWidth: 320,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  exploreBtnText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '800',
  },
});
