export const COLORS = {
  // Brand Primary & Accents (Modern Indigo & Violet Palette)
  primary: '#4F46E5', // Indigo 600
  primaryDark: '#3730A3', // Indigo 800
  primaryDarker: '#1E1B4B', // Indigo 950
  primaryLight: '#EEF2FF', // Indigo 50
  primaryLighter: '#E0E7FF', // Indigo 100
  primaryGradientStart: '#6366F1', // Indigo 500
  primaryGradientEnd: '#4338CA', // Indigo 700

  // Secondary & Accents (Vibrant Sky & Teal)
  secondary: '#0EA5E9', // Sky 500
  secondaryLight: '#E0F2FE', // Sky 100
  secondaryDark: '#0369A1', // Sky 700
  accentPurple: '#8B5CF6', // Purple 500
  accentPurpleLight: '#F5F3FF',

  // Statuses (Emerald, Amber, Crimson)
  success: '#10B981', // Emerald 500
  successLight: '#D1FAE5', // Emerald 100
  successDark: '#065F46', // Emerald 800
  successBg: '#ECFDF5',

  warning: '#F59E0B', // Amber 500
  warningLight: '#FEF3C7', // Amber 100
  warningDark: '#92400E', // Amber 800
  warningBg: '#FFFBEB',

  error: '#EF4444', // Red 500
  errorLight: '#FEE2E2', // Red 100
  errorDark: '#991B1B', // Red 800
  errorBg: '#FEF2F2',

  // Backgrounds & Surfaces (Clean Slate & Zinc Neutrals)
  background: '#F8FAFC', // Slate 50
  backgroundAlt: '#F1F5F9', // Slate 100
  cardBg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  surfaceActive: '#F1F5F9',

  // Typography Colors
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  textLight: '#FFFFFF',
  textLightSubtle: 'rgba(255, 255, 255, 0.85)',

  // Borders & Dividers
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1', // Slate 300
  borderActive: '#818CF8', // Indigo 400
  borderSubtle: '#F1F5F9',

  // Time Slots Interactive Status
  slotAvailableBg: '#FFFFFF',
  slotAvailableBorder: '#E2E8F0',
  slotAvailableText: '#0F172A',
  
  slotBookedBg: '#F1F5F9',
  slotBookedBorder: '#E2E8F0',
  slotBookedText: '#94A3B8',

  slotSelectedBg: '#EEF2FF',
  slotSelectedBorder: '#4F46E5',
  slotSelectedText: '#3730A3',

  // Glassmorphism & Overlays
  backdrop: 'rgba(15, 23, 42, 0.65)',
  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassCard: 'rgba(255, 255, 255, 0.85)',
  glassDark: 'rgba(15, 23, 42, 0.75)',
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  floating: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
};
