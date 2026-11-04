import { Dimensions } from 'react-native';
import { ThemeColors, ThemeId } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const THEMES: Record<ThemeId, ThemeColors> = {
  'neon-lime': {
    id: 'neon-lime',
    name: 'Neon Lime (Reel Original)',
    bg: '#FAF8F3', // Soft Ivory
    ink: '#0B090B', // Midnight Black
    accent: '#CDF22B', // Neon Lime Green
    surface: '#FFFFFF',
    surfaceElevated: '#F1EDE3',
    muted: '#5C564E',
    line: 'rgba(11, 9, 11, 0.16)',
    lineStrong: 'rgba(11, 9, 11, 0.85)',
    pass: '#0E7A4F',
    fail: '#B3261E',
    contrastText: '18.70:1 AAA',
    contrastBtn: '15.43:1 AAA',
    isDark: false,
  },
  'midnight-lime': {
    id: 'midnight-lime',
    name: 'Midnight Lime (Dark Flip)',
    bg: '#0B090B',
    ink: '#FAF8F3',
    accent: '#CDF22B',
    surface: '#151315',
    surfaceElevated: '#201C20',
    muted: '#8E8B84',
    line: 'rgba(255, 255, 255, 0.14)',
    lineStrong: 'rgba(255, 255, 255, 0.85)',
    pass: '#22C55E',
    fail: '#EF4444',
    contrastText: '18.70:1 AAA',
    contrastBtn: '15.43:1 AAA',
    isDark: true,
  },
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour (Dark-First)',
    bg: '#0B0B08',
    ink: '#F5F3FF',
    accent: '#FFC900',
    surface: '#181712',
    surfaceElevated: '#25231B',
    muted: '#9E9A86',
    line: 'rgba(255, 201, 0, 0.2)',
    lineStrong: 'rgba(255, 201, 0, 0.8)',
    pass: '#10B981',
    fail: '#EF4444',
    contrastText: '17.20:1 AAA',
    contrastBtn: '12.77:1 AAA',
    isDark: true,
  },
  'cobalt-lime': {
    id: 'cobalt-lime',
    name: 'Cobalt Lime (High Energy)',
    bg: '#0B0E11',
    ink: '#FFFFFF',
    accent: '#D4FF4F',
    surface: '#131920',
    surfaceElevated: '#1D2530',
    muted: '#8A99AD',
    line: 'rgba(29, 104, 233, 0.28)',
    lineStrong: 'rgba(212, 255, 79, 0.85)',
    pass: '#10B981',
    fail: '#EF4444',
    contrastText: '19.10:1 AAA',
    contrastBtn: '16.79:1 AAA',
    isDark: true,
  },
};

export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  contentPadding: 18,
  cardRadius: 18,
  pillRadius: 999,
  minTouchTarget: 48,
};
