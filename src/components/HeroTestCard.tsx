import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';
import { WaveBarState } from '../utils/audioEngine';

interface HeroTestCardProps {
  colors: ThemeColors;
  isRunning: boolean;
  elapsedTime: number;
  duration: number;
  waveData: WaveBarState[];
  selectedFrequency?: number;
  onSelectFrequency?: (freq: number) => void;
  onToggleTest: () => void;
}

const FREQUENCY_PRESETS = [
  { label: '100 Hz', value: 100, sub: 'Bass' },
  { label: '440 Hz', value: 440, sub: 'Mid' },
  { label: '1 kHz', value: 1000, sub: 'Std' },
  { label: '4 kHz', value: 4000, sub: 'Vocal' },
  { label: '12 kHz', value: 12000, sub: 'High' },
];

const HeroTestCard: React.FC<HeroTestCardProps> = ({
  colors,
  isRunning,
  elapsedTime,
  duration,
  waveData,
  selectedFrequency = 1000,
  onSelectFrequency,
  onToggleTest,
}) => {
  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.line,
        },
      ]}
    >
      {/* Subtitle / Spec tag */}
      <View style={styles.topRow}>
        <Text style={[styles.lbl, { color: colors.ink }]}>
          TEST TONE · {selectedFrequency >= 1000 ? `${selectedFrequency / 1000} KHZ` : `${selectedFrequency} HZ`}
        </Text>
        {isRunning && (
          <View style={[styles.liveTag, { backgroundColor: colors.accent }]}>
            <Text style={styles.liveTagText}>ACTIVE</Text>
          </View>
        )}
      </View>

      {/* Big Headline */}
      <Text style={[styles.big, { color: colors.ink }]}>
        {isRunning ? `Testing speaker... (${(duration - elapsedTime).toFixed(1)}s)` : 'Check your speaker'}
      </Text>

      {/* Frequency Presets Row */}
      <View style={styles.presetsRow}>
        {FREQUENCY_PRESETS.map((p) => {
          const isSelected = selectedFrequency === p.value;
          return (
            <TouchableOpacity
              key={p.value}
              onPress={() => onSelectFrequency?.(p.value)}
              style={[
                styles.presetPill,
                {
                  backgroundColor: isSelected ? colors.accent : colors.surface,
                  borderColor: isSelected ? colors.lineStrong : colors.line,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.presetText,
                  { color: isSelected ? '#0B090B' : colors.ink },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 12-Bar Sound Visualizer (matching HTML mockup) */}
      <View style={styles.waveContainer} aria-hidden={true}>
        {waveData.map((bar, idx) => {
          return (
            <View
              key={`bar-${idx}`}
              style={[
                styles.waveBar,
                {
                  height: `${bar.heightPercent}%`,
                  backgroundColor: bar.isHot ? colors.accent : colors.ink,
                  opacity: bar.isHot ? 1 : 0.28,
                  borderColor: bar.isHot ? colors.lineStrong : 'transparent',
                  borderWidth: bar.isHot ? 1 : 0,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Action CTA Button (Neon Lime pill with dark text — 15.43:1 AAA) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggleTest}
        style={[styles.playBtn, { backgroundColor: colors.accent }]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={isRunning ? 'Stop speaker test' : 'Run 1 kHz speaker test'}
      >
        <Text style={styles.playBtnText}>
          {isRunning ? '⏹  Stop test' : '▶  Run speaker test'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginHorizontal: 16,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lbl: {
    fontFamily: 'Courier',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.75,
    fontWeight: '700',
  },
  liveTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0B090B',
  },
  big: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 2,
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 48,
    marginBottom: 14,
  },
  waveBar: {
    flex: 1,
    borderRadius: 3,
    minHeight: 4,
  },
  playBtn: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  playBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B090B', // 15.43:1 AAA contrast
    letterSpacing: 0.2,
  },
});

export default React.memo(HeroTestCard);
