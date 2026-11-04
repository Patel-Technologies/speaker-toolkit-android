import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SoundTest, ThemeColors } from '../types';

interface TestRowItemProps {
  test: SoundTest;
  colors: ThemeColors;
  isLast?: boolean;
  onPress: (test: SoundTest) => void;
}

const TestRowItem: React.FC<TestRowItemProps> = ({
  test,
  colors,
  isLast,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(test)}
      style={[
        styles.testRow,
        {
          borderBottomColor: colors.line,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Run ${test.title}: ${test.subtitle}`}
    >
      {/* Icon Container (matching HTML mockup .ic) */}
      <View
        style={[
          styles.ic,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.line,
          },
        ]}
      >
        <Text style={styles.iconText}>{test.icon}</Text>
      </View>

      {/* Text Info (matching HTML mockup .tx) */}
      <View style={styles.tx}>
        <Text style={[styles.titleText, { color: colors.ink }]}>{test.title}</Text>
        <Text style={[styles.subtitleText, { color: colors.muted }]}>
          {test.subtitle}
        </Text>
      </View>

      {/* Chevron › (matching HTML mockup .chev) */}
      <Text style={[styles.chev, { color: colors.muted }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ic: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  tx: {
    flex: 1,
  },
  titleText: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  chev: {
    fontSize: 20,
    fontWeight: '700',
    opacity: 0.6,
  },
});

export default React.memo(TestRowItem);
