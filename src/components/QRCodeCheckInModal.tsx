import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Booking } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { FastQRCode } from './FastQRCode';
import {
  X,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { format } from 'date-fns';

interface QRCodeCheckInModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const QRCodeCheckInModal: React.FC<QRCodeCheckInModalProps> = ({
  booking,
  onClose,
}) => {
  const [localCheckedIn, setLocalCheckedIn] = useState(false);
  const checkInBooking = useBookingStore((state) => state.checkInBooking);

  if (!booking) return null;

  const isCheckedIn = booking.status === 'checked_in' || localCheckedIn;

  const handleSimulateCheckIn = async () => {
    await checkInBooking(booking.id);
    setLocalCheckedIn(true);
  };

  return (
    <Modal
      visible={!!booking}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.ticketContainer}>
          {/* Top Notch Header */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <QrCode size={18} color={COLORS.textLight} style={{ marginRight: 6 }} />
              <Text style={styles.headerTitle}>Vé Phòng Học Điện Tử (E-Pass)</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* Ticket Body Scrollable */}
          <ScrollView
            style={styles.ticketScroll}
            contentContainerStyle={styles.ticketBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Booking Code */}
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>MÃ ĐẶT CHỖ DUY NHẤT</Text>
              <Text style={styles.bookingCodeText}>{booking.bookingCode}</Text>
            </View>

            {/* Instant Vector SVG QR Code Canvas */}
            <View style={styles.qrWrapper}>
              <FastQRCode
                value={booking.qrPayload || booking.bookingCode}
                size={190}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
              {isCheckedIn && (
                <View style={styles.checkedInOverlay}>
                  <CheckCircle2 size={42} color={COLORS.success} />
                  <Text style={styles.checkedInOverlayText}>ĐÃ CHECK-IN</Text>
                  <Text style={styles.checkedInOverlaySub}>Phòng đã mở khóa</Text>
                </View>
              )}
            </View>

            <Text style={styles.qrInstruction}>
              {isCheckedIn
                ? '✅ Đã nhận phòng học thành công. Vui lòng giữ gìn thiết bị!'
                : 'Đưa mã này trước camera/máy quét tại cửa phòng để mở cửa.'}
            </Text>

            {/* Dashed Line Separator */}
            <View style={styles.dashedDivider}>
              <View style={styles.notchLeft} />
              <View style={styles.dashLine} />
              <View style={styles.notchRight} />
            </View>

            {/* Booking Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phòng học</Text>
                <Text style={styles.detailValue}>{booking.roomCode} ({booking.roomName})</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Vị trí</Text>
                <Text style={styles.detailValue}>Tòa {booking.building} • Tầng {booking.floor}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailItem, { flex: 1 }]}>
                  <Text style={styles.detailLabel}>Ngày đặt</Text>
                  <Text style={styles.detailValue}>
                    {format(new Date(booking.date), 'dd/MM/yyyy')}
                  </Text>
                </View>
                <View style={[styles.detailItem, { flex: 1 }]}>
                  <Text style={styles.detailLabel}>Khung giờ (2h)</Text>
                  <Text style={[styles.detailValue, { color: COLORS.primaryDark, fontWeight: '800' }]}>
                    {booking.timeSlot.label}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.detailItem, { flex: 1 }]}>
                  <Text style={styles.detailLabel}>Sinh viên</Text>
                  <Text style={styles.detailValue}>{booking.userName}</Text>
                </View>
                <View style={[styles.detailItem, { flex: 1 }]}>
                  <Text style={styles.detailLabel}>MSSV</Text>
                  <Text style={styles.detailValue}>{booking.studentId}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {!isCheckedIn ? (
                <TouchableOpacity
                  style={styles.checkInBtn}
                  onPress={handleSimulateCheckIn}
                  activeOpacity={0.85}
                >
                  <Sparkles size={16} color={COLORS.textLight} style={{ marginRight: 6 }} />
                  <Text style={styles.checkInBtnText}>Mô phỏng Quét Check-in Ngay</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.statusSuccessCard}>
                  <Check size={16} color={COLORS.successDark} style={{ marginRight: 6 }} />
                  <Text style={styles.statusSuccessText}>
                    Trạng thái: Đã nhận phòng học thành công
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.75}>
                <Text style={styles.doneBtnText}>Hoàn tất / Đóng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ticketContainer: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '90%',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.floating,
    zIndex: 10,
  },
  headerBar: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.full,
  },
  ticketScroll: {
    maxHeight: '100%',
  },
  ticketBody: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  bookingCodeText: {
    fontSize: 23,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  qrWrapper: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: 5,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.md,
  },
  checkedInOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  checkedInOverlayText: {
    color: COLORS.successDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  checkedInOverlaySub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  qrInstruction: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: SPACING.sm,
    fontWeight: '500',
  },
  dashedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '120%',
    marginVertical: SPACING.md,
    position: 'relative',
  },
  notchLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.backdrop,
    marginLeft: -9,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderStyle: 'dashed',
  },
  notchRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.backdrop,
    marginRight: -9,
  },
  detailsGrid: {
    width: '100%',
    gap: 8,
    marginBottom: SPACING.md,
  },
  detailItem: {
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  actionContainer: {
    width: '100%',
    gap: 8,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  checkInBtnText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '800',
  },
  statusSuccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusSuccessText: {
    color: COLORS.successDark,
    fontSize: 12,
    fontWeight: '800',
  },
  doneBtn: {
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  doneBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
