import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Room, TimeSlot } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { AMENITY_DETAILS } from '../constants/slots';
import { useBookingStore } from '../store/useBookingStore';
import { DatePickerBar } from '../components/DatePickerBar';
import { TimeSlotGrid } from '../components/TimeSlotGrid';
import { BookingModal } from '../components/BookingModal';
import {
  ArrowLeft,
  Heart,
  Star,
  Users,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Tv,
  PenTool,
  Monitor,
  Wind,
  Info,
} from 'lucide-react-native';
import { format } from 'date-fns';

interface RoomDetailScreenProps {
  room: Room;
  onBack: () => void;
}

const AMENITY_ICON_MAP: Record<string, any> = {
  projector: Tv,
  whiteboard: PenTool,
  high_spec_pc: Monitor,
  air_conditioner: Wind,
};

export const RoomDetailScreen: React.FC<RoomDetailScreenProps> = ({
  room,
  onBack,
}) => {
  const filter = useBookingStore((state) => state.filter);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const favorites = useBookingStore((state) => state.favorites);
  const toggleFavorite = useBookingStore((state) => state.toggleFavorite);
  const isSlotBooked = useBookingStore((state) => state.isSlotBooked);

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isFav = favorites.includes(room.id);
  const currentDate = filter.selectedDate;

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    // Reset selected slot if the new date has conflict with it
    if (selectedSlot && isSlotBooked(room.id, date, selectedSlot.id)) {
      setSelectedSlot(null);
    }
  };

  const handleOpenBookingModal = () => {
    if (!selectedSlot) return;
    setShowConfirmModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Image Container */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: room.imageUrl }} style={styles.heroImage} />

          {/* Top Floating Navigation Bar */}
          <View style={styles.heroTopNav}>
            <TouchableOpacity style={styles.navCircleBtn} onPress={onBack} activeOpacity={0.85}>
              <ArrowLeft size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => toggleFavorite(room.id)}
              activeOpacity={0.85}
            >
              <Heart
                size={20}
                color={isFav ? '#EF4444' : COLORS.textPrimary}
                fill={isFav ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Hero Bottom Badges */}
          <View style={styles.heroBottomBadges}>
            <View style={styles.buildingBadge}>
              <Layers size={13} color={COLORS.textLight} style={{ marginRight: 4 }} />
              <Text style={styles.buildingBadgeText}>
                Tòa {room.building} • Tầng {room.floor}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Star size={13} color="#EAB308" fill="#EAB308" style={{ marginRight: 3 }} />
              <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
              <Text style={styles.reviewText}>({room.reviewCount} đánh giá)</Text>
            </View>
          </View>
        </View>

        {/* 2. Room Title & Specs */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <View style={styles.codePill}>
              <Text style={styles.codePillText}>{room.code}</Text>
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
          </View>

          <Text style={styles.description}>{room.description}</Text>

          {/* Key Metric Pills */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconCircle, { backgroundColor: COLORS.primaryLight }]}>
                <Users size={18} color={COLORS.primary} />
              </View>
              <View style={styles.metricTextGroup}>
                <Text style={styles.metricLabel}>Sức chứa</Text>
                <Text style={styles.metricValue}>{room.capacity} sinh viên</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconCircle, { backgroundColor: COLORS.successLight }]}>
                <ShieldCheck size={18} color={COLORS.success} />
              </View>
              <View style={styles.metricTextGroup}>
                <Text style={styles.metricLabel}>Không gian</Text>
                <Text style={styles.metricValue}>Cách âm 100%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Amenities Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trang thiết bị & Tiện nghi</Text>
          <View style={styles.amenitiesGrid}>
            {room.amenities.map((amenity) => {
              const info = AMENITY_DETAILS[amenity];
              const IconComponent = AMENITY_ICON_MAP[amenity];
              return (
                <View key={amenity} style={styles.amenityRow}>
                  <View style={styles.amenityIconCircle}>
                    {IconComponent && <IconComponent size={16} color={COLORS.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.amenityName}>{info?.label || amenity}</Text>
                    <Text style={styles.amenityDesc}>{info?.description || 'Trang bị chất lượng cao'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 4. 7-Day Date Selector */}
        <DatePickerBar selectedDate={currentDate} onSelectDate={handleSelectDate} />

        {/* 5. 2-Hour Time Slot Grid & Conflict Engine */}
        <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.md }}>
          <TimeSlotGrid
            roomId={room.id}
            date={currentDate}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
          />
        </View>

        {/* Campus Rules Notice */}
        <View style={styles.rulesNotice}>
          <Info size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.rulesNoticeText}>
            Quy định: Có mặt đúng giờ và quét mã QR check-in trong vòng 15 phút đầu ca học để giữ chỗ.
          </Text>
        </View>
      </ScrollView>

      {/* 6. Sticky Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.slotSummary}>
          <Text style={styles.slotSummaryLabel}>
            {selectedSlot ? 'Ca học đã chọn:' : 'Vui lòng chọn 1 ca học:'}
          </Text>
          <Text style={styles.slotSummaryValue} numberOfLines={1}>
            {selectedSlot
              ? `${selectedSlot.label} • ${format(new Date(currentDate), 'dd/MM')}`
              : 'Chưa có ca nào được chọn'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            !selectedSlot && styles.bookButtonDisabled,
          ]}
          disabled={!selectedSlot}
          onPress={handleOpenBookingModal}
          activeOpacity={0.85}
        >
          <CheckCircle size={18} color={COLORS.textLight} style={{ marginRight: 6 }} />
          <Text style={styles.bookButtonText}>Đặt phòng ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Confirmation Dialog */}
      <BookingModal
        visible={showConfirmModal}
        room={room}
        date={currentDate}
        timeSlot={selectedSlot}
        onClose={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroWrapper: {
    height: 260,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroTopNav: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  heroBottomBadges: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buildingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  buildingBadgeText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '800',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#854D0E',
  },
  reviewText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 2,
    fontWeight: '600',
  },
  mainInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  codePill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  codePillText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  roomName: {
    flex: 1,
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: SPACING.md,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTextGroup: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amenitiesGrid: {
    gap: 10,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  amenityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  amenityDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rulesNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  rulesNoticeText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.primaryDark,
    lineHeight: 17,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 28 : SPACING.md,
    ...SHADOWS.floating,
  },
  slotSummary: {
    flex: 1,
    marginRight: SPACING.md,
  },
  slotSummaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slotSummaryValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.borderDark,
    shadowOpacity: 0,
  },
  bookButtonText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
});
