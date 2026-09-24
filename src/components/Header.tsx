import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { Bell, Sparkles } from 'lucide-react-native';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const user = useBookingStore((state) => state.user);
  const bookings = useBookingStore((state) => state.bookings);

  const activeBookingsCount = React.useMemo(() => {
    return bookings.filter(
      (b) =>
        b.userId === user.id &&
        (b.status === 'active' || b.status === 'checked_in')
    ).length;
  }, [bookings, user.id]);

  return (
    <View style={styles.container}>
      {/* Left: User Avatar & Greeting */}
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.onlineBadge} />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.userName}>{user.name.split(' ').slice(-1)[0]} 👋</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.studentIdBadge}>
              <Text style={styles.studentIdText}>MSSV: {user.studentId}</Text>
            </View>
            <View style={styles.roleBadge}>
              <Sparkles size={11} color={COLORS.primary} style={{ marginRight: 3 }} />
              <Text style={styles.roleText}>Campus Pro</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right: Notifications button */}
      <TouchableOpacity
        style={styles.notifButton}
        onPress={onOpenNotifications}
        activeOpacity={0.7}
      >
        <Bell size={20} color={COLORS.textPrimary} />
        {activeBookingsCount > 0 && (
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>{activeBookingsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: Platform.OS === 'ios' ? 12 : SPACING.md,
    ...SHADOWS.sm,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: COLORS.primaryLighter,
    backgroundColor: COLORS.surfaceSubtle,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  userInfo: {
    justifyContent: 'center',
    gap: 3,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greetingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentIdBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studentIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  notifBadgeText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '900',
  },
});
