import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Booking } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
} from 'lucide-react-native';
import { format } from 'date-fns';

interface ActiveBookingCardProps {
  booking: Booking;
  onOpenQR: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
}

export const ActiveBookingCard: React.FC<ActiveBookingCardProps> = ({
  booking,
  onOpenQR,
  onCancel,
}) => {
  const isCheckedIn = booking.status === 'checked_in';
  const isCancelled = booking.status === 'cancelled';
  const isActive = booking.status === 'active';

  const handleCancelPress = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn hủy đặt phòng ${booking.roomCode} vào ca ${booking.timeSlot.label} không? Khung giờ này sẽ được giải phóng ngay.`
      );
      if (confirmed) {
        onCancel(booking.id);
      }
    } else {
      Alert.alert(
        'Hủy Đặt Phòng Học',
        `Bạn có chắc chắn muốn hủy phòng ${booking.roomCode} ca ${booking.timeSlot.label} ngày ${booking.date}?`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Đồng ý hủy',
            style: 'destructive',
            onPress: () => onCancel(booking.id),
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      {/* Header Row: Room Code & Status Badge */}
      <View style={styles.headerRow}>
        <View style={styles.roomCodeContainer}>
          <View style={styles.codePill}>
            <Text style={styles.codeText}>{booking.roomCode}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.roomName} numberOfLines={1}>
              {booking.roomName}
            </Text>
            <Text style={styles.bookingCode}>Mã: {booking.bookingCode}</Text>
          </View>
        </View>

        {/* Status Tag */}
        {isCheckedIn ? (
          <View style={[styles.statusTag, styles.statusCheckedIn]}>
            <CheckCircle2 size={12} color={COLORS.successDark} style={{ marginRight: 3 }} />
            <Text style={[styles.statusText, { color: COLORS.successDark }]}>Đã Check-in</Text>
          </View>
        ) : isCancelled ? (
          <View style={[styles.statusTag, styles.statusCancelled]}>
            <XCircle size={12} color={COLORS.error} style={{ marginRight: 3 }} />
            <Text style={[styles.statusText, { color: COLORS.error }]}>Đã hủy</Text>
          </View>
        ) : (
          <View style={[styles.statusTag, styles.statusActive]}>
            <AlertCircle size={12} color={COLORS.primary} style={{ marginRight: 3 }} />
            <Text style={[styles.statusText, { color: COLORS.primary }]}>Chờ nhận phòng</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Info Rows */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {format(new Date(booking.date), 'EEEE, dd/MM/yyyy')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={14} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.primaryDark, fontWeight: '700' }]}>
            {booking.timeSlot.label} ({booking.timeSlot.sessionName})
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            Tòa {booking.building} • Tầng {booking.floor}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Users size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {booking.attendeesCount} bạn • {booking.purpose}
          </Text>
        </View>
      </View>

      {/* Actions (Only for Active / CheckedIn) */}
      {!isCancelled && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.qrActionBtn}
            onPress={() => onOpenQR(booking)}
            activeOpacity={0.7}
          >
            <QrCode size={15} color={COLORS.textLight} style={{ marginRight: 6 }} />
            <Text style={styles.qrActionText}>Mở mã QR Check-in</Text>
          </TouchableOpacity>

          {isActive && (
            <TouchableOpacity
              style={styles.cancelActionBtn}
              onPress={handleCancelPress}
              activeOpacity={0.7}
            >
              <Trash2 size={15} color={COLORS.error} />
              <Text style={styles.cancelActionText}>Hủy phòng</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  cardCancelled: {
    opacity: 0.65,
    backgroundColor: COLORS.surfaceSubtle,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  codePill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  codeText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },
  roomName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bookingCode: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
    fontWeight: '600',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLighter,
  },
  statusCheckedIn: {
    backgroundColor: COLORS.successLight,
    borderColor: '#A7F3D0',
  },
  statusCancelled: {
    backgroundColor: COLORS.errorLight,
    borderColor: '#FECACA',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  infoGrid: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  qrActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  qrActionText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '800',
  },
  cancelActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelActionText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '800',
  },
});
