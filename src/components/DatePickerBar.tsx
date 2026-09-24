import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { format, addDays, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Calendar } from 'lucide-react-native';

interface DatePickerBarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const DatePickerBar: React.FC<DatePickerBarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  // Generate 7 days starting from today
  const daysList = React.useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const dateObj = addDays(today, index);
      const formattedKey = format(dateObj, 'yyyy-MM-dd');
      const isCurrentDay = isToday(dateObj);
      
      // Vietnamese day of week label
      const dayOfWeekIndex = dateObj.getDay(); // 0 = CN, 1 = T2 ... 6 = T7
      const dayLabel = isCurrentDay
        ? 'Hôm nay'
        : dayOfWeekIndex === 0
        ? 'Chủ Nhật'
        : `Thứ ${dayOfWeekIndex + 1}`;

      const dateNumber = format(dateObj, 'dd');
      const monthLabel = format(dateObj, 'MM/yyyy');

      return {
        key: formattedKey,
        dayLabel,
        dateNumber,
        monthLabel,
        isToday: isCurrentDay,
        dateObj,
      };
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Calendar size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.title}>Chọn ngày học (7 ngày tới)</Text>
        </View>
        <Text style={styles.selectedDateBadge}>
          {format(new Date(selectedDate), 'dd/MM/yyyy')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {daysList.map((item) => {
          const isSelected = item.key === selectedDate;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                item.isToday && !isSelected && styles.dayCardToday,
              ]}
              onPress={() => onSelectDate(item.key)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelSelected,
                  item.isToday && !isSelected && styles.dayLabelToday,
                ]}
              >
                {item.dayLabel}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  isSelected && styles.dateNumberSelected,
                ]}
              >
                {item.dateNumber}
              </Text>
              <Text
                style={[
                  styles.monthLabel,
                  isSelected && styles.monthLabelSelected,
                ]}
              >
                Tháng {format(item.dateObj, 'MM')}
              </Text>

              {isSelected && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  selectedDateBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLighter,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
    paddingVertical: 2,
  },
  dayCard: {
    width: 72,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCardToday: {
    borderColor: COLORS.primaryLighter,
    backgroundColor: '#EEF2FF',
  },
  dayCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dayLabelToday: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  dayLabelSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  dateNumberSelected: {
    color: COLORS.textLight,
  },
  monthLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  monthLabelSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.textLight,
    position: 'absolute',
    bottom: 4,
  },
});
