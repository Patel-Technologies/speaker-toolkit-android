export type ThemeId =
  | 'neon-lime'
  | 'midnight-lime'
  | 'golden-hour'
  | 'cobalt-lime';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  bg: string;
  ink: string;
  accent: string;
  surface: string;
  surfaceElevated: string;
  muted: string;
  line: string;
  lineStrong: string;
  pass: string;
  fail: string;
  contrastText: string;
  contrastBtn: string;
  isDark: boolean;
}

export type TabType = 'home' | 'tests' | 'history' | 'settings';

export type TestId =
  | 'speaker-1khz'
  | 'earpiece'
  | 'headphone-lr'
  | 'vibration'
  | 'water-eject'
  | 'decibel-meter'
  | 'frequency-sweep';

export interface SoundTest {
  id: TestId;
  title: string;
  subtitle: string;
  icon: string;
  durationSeconds: number;
  category: 'core' | 'hardware' | 'cleaning' | 'diagnostics';
  description: string;
}

export interface TestHistoryEntry {
  id: string;
  testId: TestId;
  testTitle: string;
  timestamp: string;
  passed: boolean;
  notes: string;
}

export interface AppSettings {
  theme: ThemeId;
  volumeBoostEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  safetyLimiter: boolean;
  lastVolume: number;
}
