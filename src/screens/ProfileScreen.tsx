import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useBookingStore } from '../store/useBookingStore';
import { NotificationService } from '../services/notificationService';
import {
  User,
  Award,
  Clock,
  CheckCircle2,
  Building,
  Bell,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { user, bookings } = useBookingStore();

  const completedOrCheckedIn = bookings.filter(
    (b) => b.userId === user.id && (b.status === 'checked_in' || b.status === 'completed')
  );

  const totalHours = completedOrCheckedIn.length * 2;
  const punctualityRate = bookings.length > 0 ? 100 : 98;

  const handleTestNotification = async () => {
    const granted = await NotificationService.requestPermissions();
    if (Platform.OS === 'web') {
      alert('🔔 Thông báo đẩy cục bộ đang hoạt động! Bạn sẽ nhận thông báo nhắc trước 15 phút ca học.');
    } else {
      Alert.alert(
        'Thông báo Cục bộ (expo-notifications)',
        granted
          ? '✅ Quyền thông báo đã được cấp. Hệ thống sẽ tự động nhắc nhở trước 15 phút nhận phòng.'
          : '⚠️ Vui lòng cấp quyền thông báo trong cài đặt thiết bị để nhận nhắc nhở check-in.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Student ID Card Hero */}
      <View style={styles.idCard}>
        <View style={styles.idCardHeader}>
          <View style={styles.campusBrand}>
            <Sparkles size={16} color={COLORS.textLight} />
            <Text style={styles.campusBrandText}>CAMPUS SMART PASS</Text>
          </View>
          <View style={styles.verifiedTag}>
            <ShieldCheck size={12} color={COLORS.successDark} />
            <Text style={styles.verifiedText}>Sinh viên chính quy</Text>
          </View>
        </View>

        <View style={styles.idCardBody}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{user.name}</Text>
            <Text style={styles.studentIdText}>MSSV: {user.studentId}</Text>
            <Text style={styles.departmentText}>{user.department}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>
      </View>

      {/* Study Stats Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thống kê Học tập & Đặt phòng</Text>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#EEF2FF' }]}>
            <Clock size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.statNumber}>{totalHours}h</Text>
          <Text style={styles.statLabel}>Giờ đã học nhóm</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#D1FAE5' }]}>
            <CheckCircle2 size={18} color={COLORS.success} />
          </View>
          <Text style={styles.statNumber}>{punctualityRate}%</Text>
          <Text style={styles.statLabel}>Tỷ lệ đúng giờ</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Building size={18} color={COLORS.warning} />
          </View>
          <Text style={styles.statNumber}>Tòa A</Text>
          <Text style={styles.statLabel}>Tòa hay dùng nhất</Text>
        </View>
      </View>

      {/* Settings & Testing Menu */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cài đặt & Hỗ trợ</Text>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleTestNotification}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: COLORS.primaryLight }]}>
            <Bell size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemTitle}>Kiểm tra Thông báo Nhắc nhở (-15p)</Text>
            <Text style={styles.menuItemSub}>Tích hợp expo-notifications cục bộ</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.menuIconCircle, { backgroundColor: '#F1F5F9' }]}>
            <FileText size={18} color={COLORS.textPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemTitle}>Nội quy Phòng học Campus 2026</Text>
            <Text style={styles.menuItemSub}>Giữ gìn vệ sinh và thiết bị công nghệ</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.menuIconCircle, { backgroundColor: '#F1F5F9' }]}>
            <HelpCircle size={18} color={COLORS.textPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemTitle}>Hỗ trợ Kỹ thuật & Quản trị Thiết bị</Text>
            <Text style={styles.menuItemSub}>Hotline trực ban: (028) 3835 4401</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Footer Version */}
      <View style={styles.footerNote}>
        <Text style={styles.versionText}>Campus Study Room Booking • v1.0.0 (Expo SDK 52)</Text>
        <Text style={styles.authorText}>Designed with Senior React Native Architecture</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: SPACING.lg,
    paddingBottom: 40,
  },
  idCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: RADIUS.xxl,
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#4338CA',
    ...SHADOWS.floating,
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  campusBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campusBrandText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  idCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#818CF8',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: -0.2,
  },
  studentIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#A5B4FC',
    marginTop: 2,
  },
  departmentText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    fontWeight: '500',
  },
  emailText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 1,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 10,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.xs,
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 12,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  menuItemSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  authorText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});
