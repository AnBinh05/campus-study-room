import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { BuildingType, CapacityCategory, AmenityType } from '../types';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Tv,
  PenTool,
  Monitor,
  Wind,
  Users,
} from 'lucide-react-native';

const BUILDINGS: { id: 'ALL' | BuildingType; label: string; desc: string }[] = [
  { id: 'ALL', label: 'Tất cả Tòa', desc: 'Toàn trường' },
  { id: 'A', label: 'Tòa A', desc: 'Công nghệ' },
  { id: 'B', label: 'Tòa B', desc: 'Kinh tế & Sáng tạo' },
  { id: 'C', label: 'Tòa C', desc: 'Thư viện trung tâm' },
  { id: 'V', label: 'Tòa V', desc: 'Khu Đổi mới V-Tech' },
];

const CAPACITIES: { id: CapacityCategory; label: string; range: string }[] = [
  { id: 'ALL', label: 'Mọi sức chứa', range: '2-20' },
  { id: 'small', label: '2-4 bạn', range: 'Nhóm nhỏ' },
  { id: 'medium', label: '5-8 bạn', range: 'Nhóm vừa' },
  { id: 'large', label: '9-20 bạn', range: 'Hội thảo' },
];

const AMENITIES_LIST: { id: AmenityType; label: string; Icon: any }[] = [
  { id: 'projector', label: 'Máy chiếu', Icon: Tv },
  { id: 'whiteboard', label: 'Bảng trắng', Icon: PenTool },
  { id: 'high_spec_pc', label: 'PC cấu hình cao', Icon: Monitor },
  { id: 'air_conditioner', label: 'Điều hòa', Icon: Wind },
];

export const FilterBar: React.FC = () => {
  const { filter, setFilter, resetFilter } = useBookingStore();

  const handleToggleAmenity = (amenityId: AmenityType) => {
    const current = filter.amenities;
    const exists = current.includes(amenityId);
    const updated = exists
      ? current.filter((a) => a !== amenityId)
      : [...current, amenityId];
    setFilter({ amenities: updated });
  };

  const isFilterActive =
    filter.building !== 'ALL' ||
    filter.capacityFilter !== 'ALL' ||
    filter.amenities.length > 0 ||
    filter.searchQuery.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      {/* 1. Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên phòng, mã phòng (vd: A.204)..."
            placeholderTextColor={COLORS.textMuted}
            value={filter.searchQuery}
            onChangeText={(text) => setFilter({ searchQuery: text })}
          />
          {filter.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setFilter({ searchQuery: '' })}
              style={styles.clearSearchBtn}
            >
              <X size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {isFilterActive && (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={resetFilter}
            activeOpacity={0.7}
          >
            <RotateCcw size={15} color={COLORS.error} />
            <Text style={styles.resetBtnText}>Đặt lại</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Building Tabs Carousel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tòa nhà</Text>
        <Text style={styles.sectionHint}>Chọn khu vực phòng học</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {BUILDINGS.map((b) => {
          const isSelected = filter.building === b.id;
          return (
            <TouchableOpacity
              key={b.id}
              style={[styles.buildingChip, isSelected && styles.buildingChipActive]}
              onPress={() => setFilter({ building: b.id })}
              activeOpacity={0.75}
            >
              <Text style={[styles.buildingChipText, isSelected && styles.chipTextActive]}>
                {b.label}
              </Text>
              <Text style={[styles.buildingChipSub, isSelected && styles.chipSubActive]}>
                {b.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Capacity & Amenities Quick Filter Row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sức chứa & Tiện ích</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {/* Capacity chips */}
        {CAPACITIES.map((cap) => {
          const isSelected = filter.capacityFilter === cap.id;
          return (
            <TouchableOpacity
              key={cap.id}
              style={[styles.filterPill, isSelected && styles.filterPillActive]}
              onPress={() => setFilter({ capacityFilter: cap.id })}
              activeOpacity={0.75}
            >
              <Users size={14} color={isSelected ? COLORS.textLight : COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                {cap.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Amenity toggles */}
        {AMENITIES_LIST.map(({ id, label, Icon }) => {
          const isSelected = filter.amenities.includes(id);
          return (
            <TouchableOpacity
              key={id}
              style={[styles.amenityChip, isSelected && styles.amenityChipActive]}
              onPress={() => handleToggleAmenity(id)}
              activeOpacity={0.75}
            >
              <Icon
                size={14}
                color={isSelected ? COLORS.textLight : COLORS.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.amenityChipText, isSelected && styles.amenityChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceActive,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderRadius: RADIUS.md,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionHint: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
    paddingVertical: 2,
  },
  buildingChip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    minWidth: 100,
  },
  buildingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  buildingChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  buildingChipSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.textLight,
  },
  chipSubActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  filterPillTextActive: {
    color: COLORS.textLight,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityChipActive: {
    backgroundColor: COLORS.primaryDarker,
    borderColor: COLORS.primaryDarker,
    ...SHADOWS.sm,
  },
  amenityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  amenityChipTextActive: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
});
