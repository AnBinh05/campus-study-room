import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Room } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { Sparkles, HelpCircle, RotateCcw } from 'lucide-react-native';

interface ExploreScreenProps {
  onSelectRoom: (room: Room) => void;
  onOpenNotifications?: () => void;
}

const ROOM_CARD_HEIGHT = 350; // Approximate card height for getItemLayout

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectRoom,
  onOpenNotifications,
}) => {
  const rooms = useBookingStore((state) => state.rooms);
  const filter = useBookingStore((state) => state.filter);
  const favorites = useBookingStore((state) => state.favorites);
  const toggleFavorite = useBookingStore((state) => state.toggleFavorite);
  const isRoomAvailableNow = useBookingStore((state) => state.isRoomAvailableNow);
  const resetFilter = useBookingStore((state) => state.resetFilter);
  const bookings = useBookingStore((state) => state.bookings);

  const filteredRooms = useMemo(() => {
    const { searchQuery, building, capacityFilter, amenities } = filter;
    return rooms.filter((room) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesCode = room.code.toLowerCase().includes(query);
        const matchesBuilding = `tòa ${room.building.toLowerCase()}`.includes(query);
        if (!matchesName && !matchesCode && !matchesBuilding) return false;
      }
      if (building !== 'ALL' && room.building !== building) {
        return false;
      }
      if (capacityFilter !== 'ALL' && room.capacityCategory !== capacityFilter) {
        return false;
      }
      if (amenities.length > 0) {
        const hasAllAmenities = amenities.every((amenity) =>
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [rooms, filter]);

  // Pre-calculate count of available rooms
  const availableNowCount = useMemo(() => {
    return filteredRooms.filter((r) => isRoomAvailableNow(r.id)).length;
  }, [filteredRooms, isRoomAvailableNow, bookings]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      onSelectRoom(room);
    },
    [onSelectRoom]
  );

  const handleToggleFav = useCallback(
    (roomId: string) => {
      toggleFavorite(roomId);
    },
    [toggleFavorite]
  );

  const renderItem = useCallback(
    ({ item }: { item: Room }) => {
      const isAvailable = isRoomAvailableNow(item.id);
      const isFav = favorites.includes(item.id);

      return (
        <RoomCard
          room={item}
          isAvailableNow={isAvailable}
          isFavorite={isFav}
          onPress={handleRoomPress}
          onToggleFavorite={handleToggleFav}
        />
      );
    },
    [favorites, isRoomAvailableNow, handleRoomPress, handleToggleFav]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROOM_CARD_HEIGHT,
      offset: ROOM_CARD_HEIGHT * index,
      index,
    }),
    []
  );

  // Header Component containing Live Stats Banner
  const ListHeader = useMemo(() => {
    return (
      <View style={styles.listHeaderContainer}>
        {/* Banner with Live availability */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTopRow}>
              <View style={styles.bannerBadge}>
                <Sparkles size={13} color="#4338CA" />
                <Text style={styles.bannerBadgeText}>Campus Live Status</Text>
              </View>
              <View style={styles.livePulse}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Realtime</Text>
              </View>
            </View>

            <Text style={styles.bannerTitle}>
              {availableNowCount} / {filteredRooms.length} phòng đang trống
            </Text>
            <Text style={styles.bannerSub}>
              Hệ thống phòng tự học thông minh • Đặt ca học và quét mã QR tại cửa phòng
            </Text>
          </View>
        </View>

        {/* Section title */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Danh sách phòng học ({filteredRooms.length})</Text>
          <Text style={styles.sectionHint}>Chạm vào thẻ để xem lịch 7 ngày</Text>
        </View>
      </View>
    );
  }, [availableNowCount, filteredRooms.length]);

  // Empty state when filter matches nothing
  const ListEmpty = useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <HelpCircle size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
        <Text style={styles.emptySub}>
          Hãy thử đổi tòa nhà, giảm bớt điều kiện tiện ích hoặc xóa từ khóa tìm kiếm.
        </Text>
        <TouchableOpacity style={styles.resetFilterBtn} onPress={resetFilter} activeOpacity={0.8}>
          <RotateCcw size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <Text style={styles.resetFilterBtnText}>Xóa tất cả bộ lọc</Text>
        </TouchableOpacity>
      </View>
    );
  }, [resetFilter]);

  return (
    <View style={styles.container}>
      <Header onOpenNotifications={onOpenNotifications} />
      <FilterBar />

      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  listHeaderContainer: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  bannerContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  bannerContent: {
    gap: 6,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4338CA',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: -0.3,
  },
  bannerSub: {
    fontSize: 12,
    color: '#4F46E5',
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: SPACING.lg,
    maxWidth: 320,
  },
  resetFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});
