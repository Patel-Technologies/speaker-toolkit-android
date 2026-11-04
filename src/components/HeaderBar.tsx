import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';

interface HeaderBarProps {
  colors: ThemeColors;
  onToggleTheme: () => void;
  onOpenThemePicker: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  colors,
  onToggleTheme,
  onOpenThemePicker,
}) => {
  return (
    <View style={styles.container}>
      {/* Notch indicator */}
      <View style={[styles.notch, { backgroundColor: colors.ink }]} />

      {/* Status Bar: Time & 5G status (matching HTML mockup) */}
      <View style={styles.statusBar}>
        <Text style={[styles.monoStatus, { color: colors.ink }]}>9:41</Text>
        <Text style={[styles.monoStatus, { color: colors.ink }]}>5G ▰▰▰</Text>
      </View>

      {/* App Bar: Title, Avatar 'S', Theme Switcher */}
      <View style={styles.appBar}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.ink }]}>Speaker Tester</Text>
          <TouchableOpacity
            onPress={onToggleTheme}
            style={[
              styles.modePill,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Switch theme mode. Currently ${colors.isDark ? 'dark' : 'light'}`}
          >
            <Text style={[styles.modePillText, { color: colors.ink }]}>
              {colors.isDark ? '🌙 Dark' : '☀️ Light'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar 'S' pill button */}
        <TouchableOpacity
          onPress={onOpenThemePicker}
          style={[styles.avatar, { backgroundColor: colors.accent }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Open theme and color palette picker"
        >
          <Text style={styles.avatarText}>S</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  notch: {
    width: 86,
    height: 18,
    borderRadius: 999,
    alignSelf: 'center',
    opacity: 0.9,
    marginBottom: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monoStatus: {
    fontFamily: 'Courier',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.75,
    letterSpacing: 0.5,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  modePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B090B',
  },
});

export default React.memo(HeaderBar);
