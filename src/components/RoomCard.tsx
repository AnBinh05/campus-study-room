import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Room } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { AMENITY_DETAILS } from '../constants/slots';
import {
  Users,
  Star,
  Heart,
  ChevronRight,
  Tv,
  PenTool,
  Monitor,
  Wind,
  Layers,
} from 'lucide-react-native';

interface RoomCardProps {
  room: Room;
  isAvailableNow: boolean;
  isFavorite: boolean;
  onPress: (room: Room) => void;
  onToggleFavorite: (roomId: string) => void;
}

const AMENITY_ICON_MAP: Record<string, any> = {
  projector: Tv,
  whiteboard: PenTool,
  high_spec_pc: Monitor,
  air_conditioner: Wind,
};

const RoomCardComponent: React.FC<RoomCardProps> = ({
  room,
  isAvailableNow,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(room)}
      activeOpacity={0.92}
    >
      {/* 1. Room Image Container */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: room.imageUrl }} style={styles.image} />
        
        {/* Building & Floor Tag */}
        <View style={styles.locationBadge}>
          <Layers size={12} color={COLORS.textLight} style={{ marginRight: 4 }} />
          <Text style={styles.locationText}>
            Tòa {room.building} • Tầng {room.floor}
          </Text>
        </View>

        {/* Real-time Status Badge with Glowing Dot */}
        <View
          style={[
            styles.statusBadge,
            isAvailableNow ? styles.statusAvailable : styles.statusOccupied,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isAvailableNow ? COLORS.success : COLORS.error },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isAvailableNow ? COLORS.successDark : COLORS.errorDark },
            ]}
          >
            {isAvailableNow ? 'Đang trống' : 'Đã có ca'}
          </Text>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(room.id)}
          activeOpacity={0.8}
        >
          <Heart
            size={18}
            color={isFavorite ? '#EF4444' : '#FFFFFF'}
            fill={isFavorite ? '#EF4444' : 'rgba(0,0,0,0.25)'}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Room Content Info */}
      <View style={styles.content}>
        {/* Title & Rating */}
        <View style={styles.headerRow}>
          <View style={styles.titleColumn}>
            <View style={styles.codeTag}>
              <Text style={styles.codeText}>{room.code}</Text>
            </View>
            <Text style={styles.roomName} numberOfLines={1}>
              {room.name}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Star size={12} color="#EAB308" fill="#EAB308" style={{ marginRight: 3 }} />
            <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({room.reviewCount})</Text>
          </View>
        </View>

        {/* Description snippet */}
        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Badges: Capacity & Amenities */}
        <View style={styles.detailsRow}>
          {/* Capacity */}
          <View style={styles.capacityBadge}>
            <Users size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={styles.capacityText}>Sức chứa: {room.capacity} bạn</Text>
          </View>

          {/* Amenities Chips */}
          <View style={styles.amenitiesContainer}>
            {room.amenities.map((amenity) => {
              const IconComponent = AMENITY_ICON_MAP[amenity];
              const label = AMENITY_DETAILS[amenity]?.label || amenity;
              return (
                <View key={amenity} style={styles.amenityTag}>
                  {IconComponent && (
                    <IconComponent size={11} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  )}
                  <Text style={styles.amenityTagText}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer CTA */}
        <View style={styles.footerRow}>
          <Text style={styles.slotHint}>
            Khung 2h • Đặt trước 7 ngày
          </Text>
          <View style={styles.bookCta}>
            <Text style={styles.bookCtaText}>Chọn ca học</Text>
            <ChevronRight size={14} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const RoomCard = React.memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  imageWrapper: {
    height: 165,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  locationText: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  statusAvailable: {
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    borderColor: '#A7F3D0',
  },
  statusOccupied: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    borderColor: '#FECACA',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 8,
  },
  codeTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  roomName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  reviewCount: {
    fontSize: 10,
    color: '#A16207',
    marginLeft: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 10,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  capacityText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityTagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  slotHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  bookCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  bookCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
