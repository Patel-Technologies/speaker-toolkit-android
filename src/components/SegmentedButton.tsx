import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';
import { haptics } from '../utils/haptics';

interface SegmentOption<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface SegmentedButtonProps<T extends string> {
  options: SegmentOption<T>[];
  selectedKey: T;
  colors: ThemeColors;
  onSelect: (key: T) => void;
}

function SegmentedButton<T extends string>({
  options,
  selectedKey,
  colors,
  onSelect,
}: SegmentedButtonProps<T>) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.line,
        },
      ]}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.key === selectedKey;
        const isFirst = idx === 0;
        const isLast = idx === options.length - 1;

        return (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.8}
            onPress={() => {
              haptics.tap();
              onSelect(opt.key);
            }}
            style={[
              styles.segment,
              isSelected && {
                backgroundColor: colors.accent,
                borderColor: colors.lineStrong,
              },
              isFirst && styles.firstSegment,
              isLast && styles.lastSegment,
            ]}
            accessible
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${opt.label} filter, ${isSelected ? 'selected' : 'not selected'}`}
          >
            {isSelected && <Text style={styles.checkIcon}>✓</Text>}
            <Text
              style={[
                styles.segmentLabel,
                { color: isSelected ? '#0B090B' : colors.ink },
              ]}
            >
              {opt.label}
              {opt.count !== undefined ? ` (${opt.count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 42,
    borderRadius: 999, // M3 Expressive pill container
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    gap: 4,
    paddingHorizontal: 8,
  },
  firstSegment: {
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  lastSegment: {
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  checkIcon: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0B090B',
  },
  segmentLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});

export default React.memo(SegmentedButton) as typeof SegmentedButton;
