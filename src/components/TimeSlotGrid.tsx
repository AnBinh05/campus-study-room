import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TimeSlot } from '../types';
import { TIME_SLOTS } from '../constants/slots';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { Clock, Lock, CheckCircle2, Sun, Sunset, Moon } from 'lucide-react-native';

interface TimeSlotGridProps {
  roomId: string;
  date: string;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

const PERIOD_CONFIG = {
  morning: { label: 'Buổi Sáng', Icon: Sun, color: '#EA580C' },
  afternoon: { label: 'Buổi Chiều', Icon: Sunset, color: '#D97706' },
  evening: { label: 'Buổi Tối', Icon: Moon, color: '#4F46E5' },
};

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  roomId,
  date,
  selectedSlot,
  onSelectSlot,
}) => {
  const bookings = useBookingStore((state) => state.bookings);

  const isSlotBooked = React.useCallback(
    (slotId: string) => {
      return bookings.some(
        (b) =>
          b.roomId === roomId &&
          b.date === date &&
          b.timeSlot.id === slotId &&
          (b.status === 'active' || b.status === 'checked_in')
      );
    },
    [bookings, roomId, date]
  );

  // Group slots by period
  const slotsByPeriod = React.useMemo(() => {
    return {
      morning: TIME_SLOTS.filter((s) => s.period === 'morning'),
      afternoon: TIME_SLOTS.filter((s) => s.period === 'afternoon'),
      evening: TIME_SLOTS.filter((s) => s.period === 'evening'),
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Clock size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.title}>Khung giờ học khả dụng (2 tiếng/ca)</Text>
        </View>
        <Text style={styles.conflictHint}>Slot xám là đã có người đặt</Text>
      </View>

      {(['morning', 'afternoon', 'evening'] as const).map((periodKey) => {
        const config = PERIOD_CONFIG[periodKey];
        const periodSlots = slotsByPeriod[periodKey];
        const PeriodIcon = config.Icon;

        return (
          <View key={periodKey} style={styles.periodGroup}>
            {/* Period Section Header */}
            <View style={styles.periodHeader}>
              <View style={[styles.periodIconTag, { backgroundColor: `${config.color}15` }]}>
                <PeriodIcon size={14} color={config.color} />
              </View>
              <Text style={[styles.periodTitle, { color: config.color }]}>
                {config.label}
              </Text>
            </View>

            {/* Slots Grid */}
            <View style={styles.grid}>
              {periodSlots.map((slot) => {
                const booked = isSlotBooked(slot.id);
                const isSelected = selectedSlot?.id === slot.id;

                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotCard,
                      booked && styles.slotCardBooked,
                      isSelected && styles.slotCardSelected,
                    ]}
                    disabled={booked}
                    onPress={() => onSelectSlot(slot)}
                    activeOpacity={0.75}
                  >
                    {/* Top Row: Session Name & Status Icon */}
                    <View style={styles.slotTopRow}>
                      <Text
                        style={[
                          styles.sessionName,
                          booked && styles.textMuted,
                          isSelected && styles.textSelected,
                        ]}
                      >
                        {slot.sessionName}
                      </Text>
                      {booked ? (
                        <View style={styles.lockBadge}>
                          <Lock size={11} color={COLORS.textMuted} />
                        </View>
                      ) : isSelected ? (
                        <CheckCircle2 size={16} color={COLORS.primary} />
                      ) : (
                        <View style={styles.availableDot} />
                      )}
                    </View>

                    {/* Middle: Big Time Label */}
                    <Text
                      style={[
                        styles.timeText,
                        booked && styles.timeTextBooked,
                        isSelected && styles.timeTextSelected,
                      ]}
                    >
                      {slot.label}
                    </Text>

                    {/* Bottom Status Text */}
                    <View style={styles.slotBottomRow}>
                      <Text
                        style={[
                          styles.statusLabel,
                          booked && styles.statusLabelBooked,
                          isSelected && styles.statusLabelSelected,
                        ]}
                      >
                        {booked ? 'Đã kín chỗ' : isSelected ? '✓ Đang chọn' : 'Còn trống'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  conflictHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  periodGroup: {
    marginBottom: SPACING.md,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  periodIconTag: {
    padding: 4,
    borderRadius: RADIUS.xs,
  },
  periodTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  slotCardBooked: {
    backgroundColor: COLORS.surfaceSubtle,
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  slotCardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  textMuted: {
    color: COLORS.textMuted,
  },
  textSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  lockBadge: {
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 4,
  },
  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 3,
    letterSpacing: -0.2,
  },
  timeTextBooked: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  timeTextSelected: {
    color: COLORS.primary,
  },
  slotBottomRow: {
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.successDark,
  },
  statusLabelBooked: {
    color: COLORS.textMuted,
  },
  statusLabelSelected: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
