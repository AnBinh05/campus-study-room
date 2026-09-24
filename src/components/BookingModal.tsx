import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Room, TimeSlot } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { format } from 'date-fns';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  CheckCircle,
} from 'lucide-react-native';

interface BookingModalProps {
  visible: boolean;
  room: Room | null;
  date: string;
  timeSlot: TimeSlot | null;
  onClose: () => void;
}

const COMMON_PURPOSES = [
  'Thảo luận bài tập lớn',
  'Ôn thi cuối kỳ',
  'Học đồ án / Khóa luận',
  'Họp ban điều hành CLB',
  'Luyện thi IELTS / Ngoại ngữ',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  room,
  date,
  timeSlot,
  onClose,
}) => {
  const [purpose, setPurpose] = useState('Thảo luận bài tập lớn');
  const [attendeesCount, setAttendeesCount] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createBooking, user } = useBookingStore();

  if (!room || !timeSlot) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await createBooking({
      room,
      date,
      timeSlot,
      purpose,
      attendeesCount,
    });

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Có lỗi xảy ra khi đặt phòng!');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Xác nhận Đặt phòng học</Text>
              <Text style={styles.headerSub}>Kiểm tra thông tin & sinh mã QR nhận phòng</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Error Message */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Room Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{room.code}</Text>
                </View>
                <Text style={styles.roomName} numberOfLines={1}>{room.name}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <MapPin size={15} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Địa điểm:</Text>
                <Text style={styles.infoValue}>
                  Tòa {room.building} • Tầng {room.floor}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Calendar size={15} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Ngày học:</Text>
                <Text style={styles.infoValue}>
                  {format(new Date(date), 'dd/MM/yyyy')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Clock size={15} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Khung giờ:</Text>
                <Text style={[styles.infoValue, { color: COLORS.primaryDark, fontWeight: '800' }]}>
                  {timeSlot.label} ({timeSlot.sessionName})
                </Text>
              </View>
            </View>

            {/* Student Info Verification */}
            <View style={styles.studentCard}>
              <ShieldCheck size={20} color={COLORS.success} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.studentName}>{user.name} (MSSV: {user.studentId})</Text>
                <Text style={styles.studentEmail}>{user.email}</Text>
              </View>
            </View>

            {/* Purpose Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Mục đích sử dụng phòng:</Text>
              <TextInput
                style={styles.textInput}
                value={purpose}
                onChangeText={setPurpose}
                placeholder="Nhập mục đích học tập..."
                placeholderTextColor={COLORS.textMuted}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                {COMMON_PURPOSES.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.purposeTag, purpose === tag && styles.purposeTagActive]}
                    onPress={() => setPurpose(tag)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.purposeTagText,
                        purpose === tag && styles.purposeTagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Attendees Counter */}
            <View style={styles.formGroup}>
              <View style={styles.attendeesHeader}>
                <Text style={styles.fieldLabel}>Số lượng sinh viên tham gia:</Text>
                <Text style={styles.capacityLimit}>
                  Tối đa: {room.capacity} bạn
                </Text>
              </View>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={[styles.stepperBtn, attendeesCount <= 1 && styles.stepperDisabled]}
                  disabled={attendeesCount <= 1}
                  onPress={() => setAttendeesCount((c) => Math.max(1, c - 1))}
                  activeOpacity={0.8}
                >
                  <Minus size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <View style={styles.attendeeNumberWrapper}>
                  <Users size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.attendeeNumber}>{attendeesCount} bạn</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.stepperBtn,
                    attendeesCount >= room.capacity && styles.stepperDisabled,
                  ]}
                  disabled={attendeesCount >= room.capacity}
                  onPress={() => setAttendeesCount((c) => Math.min(room.capacity, c + 1))}
                  activeOpacity={0.8}
                >
                  <Plus size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notification Reminder Note */}
            <View style={styles.reminderCard}>
              <Sparkles size={16} color="#6D28D9" />
              <Text style={styles.reminderText}>
                Hệ thống sẽ gửi thông báo đẩy nhắc nhở check-in trước giờ bắt đầu <Text style={{ fontWeight: '800' }}>15 phút</Text>.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.textLight} size="small" />
              ) : (
                <>
                  <CheckCircle size={18} color={COLORS.textLight} style={{ marginRight: 6 }} />
                  <Text style={styles.confirmBtnText}>Xác nhận & Lấy mã QR</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.lg,
    ...SHADOWS.floating,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
  },
  body: {
    padding: SPACING.lg,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  codeText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '900',
  },
  roomName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    width: 65,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  studentName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  studentEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tagScroll: {
    gap: 6,
  },
  purposeTag: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  purposeTagActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  purposeTagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  purposeTagTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  attendeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLimit: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  stepperBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: {
    opacity: 0.35,
  },
  attendeeNumberWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  attendeeNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 10,
    marginBottom: SPACING.md,
  },
  reminderText: {
    flex: 1,
    fontSize: 11,
    color: '#6D28D9',
    lineHeight: 17,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textLight,
  },
});
