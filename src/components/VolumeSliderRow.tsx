import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';
import { haptics } from '../utils/haptics';

interface VolumeSliderRowProps {
  colors: ThemeColors;
  volumePercent: number;
  onVolumeChange: (vol: number) => void;
  isBoostMode: boolean;
  onToggleBoost: () => void;
}

const VolumeSliderRow: React.FC<VolumeSliderRowProps> = ({
  colors,
  volumePercent,
  onVolumeChange,
  isBoostMode,
  onToggleBoost,
}) => {
  const maxLimit = isBoostMode ? 150 : 100;
  const progressRatio = Math.min(1, volumePercent / maxLimit);

  const handleStep = (delta: number) => {
    haptics.tap();
    const next = Math.max(0, Math.min(maxLimit, volumePercent + delta));
    onVolumeChange(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
        <Text style={[styles.volLabel, { color: colors.ink }]}>VOL</Text>

        {/* Step Down Button */}
        <TouchableOpacity
          onPress={() => handleStep(-10)}
          style={[styles.stepBtn, { borderColor: colors.line }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Decrease volume"
        >
          <Text style={[styles.stepText, { color: colors.ink }]}>-</Text>
        </TouchableOpacity>

        {/* Custom Slider Track (matching HTML mockup) */}
        <View style={[styles.sliderTrack, { backgroundColor: colors.line }]}>
          <View
            style={[
              styles.sliderFill,
              {
                width: `${progressRatio * 100}%`,
                backgroundColor: isBoostMode && volumePercent > 100 ? '#EF4444' : colors.accent,
                borderColor: colors.lineStrong,
              },
            ]}
          />
          <View
            style={[
              styles.sliderKnob,
              {
                left: `${progressRatio * 100}%`,
                backgroundColor: colors.bg,
                borderColor: colors.ink,
              },
            ]}
          />
        </View>

        {/* Step Up Button */}
        <TouchableOpacity
          onPress={() => handleStep(10)}
          style={[styles.stepBtn, { borderColor: colors.line }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Increase volume"
        >
          <Text style={[styles.stepText, { color: colors.ink }]}>+</Text>
        </TouchableOpacity>

        {/* Volume Percentage Readout */}
        <Text style={[styles.volValue, { color: colors.ink }]}>{volumePercent}%</Text>
      </View>

      {/* GOODEV Volume Booster Pill (50M+ benchmark feature) */}
      <View style={styles.boosterRow}>
        <TouchableOpacity
          onPress={onToggleBoost}
          style={[
            styles.boostPill,
            {
              backgroundColor: isBoostMode ? `${colors.accent}30` : colors.surfaceElevated,
              borderColor: isBoostMode ? colors.accent : colors.line,
            },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Toggle volume boost mode. Currently ${isBoostMode ? 'enabled up to 150%' : 'standard 100%'}`}
        >
          <Text style={[styles.boostText, { color: colors.ink }]}>
            {isBoostMode ? '⚡ Boost Mode (Max 150%)' : 'Standard Audio (100%)'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
    gap: 8,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  volLabel: {
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  sliderTrack: {
    flex: 1,
    height: 7,
    borderRadius: 99,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 99,
    borderWidth: 0.5,
  },
  sliderKnob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    transform: [{ translateX: -9 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  volValue: {
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: '800',
    minWidth: 38,
    textAlign: 'right',
  },
  boosterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  boostPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  boostText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});

export default React.memo(VolumeSliderRow);
