import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { AppSettings, ThemeColors } from '../types';

interface SettingsScreenProps {
  colors: ThemeColors;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenThemePicker: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  colors,
  settings,
  onUpdateSettings,
  onOpenThemePicker,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Toolkit Settings</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          Acoustic calibration & research-backed color system
        </Text>
      </View>

      {/* Theme Section */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        <Text style={[styles.cardHeader, { color: colors.ink }]}>Color Palette & Contrast</Text>
        <TouchableOpacity
          onPress={onOpenThemePicker}
          style={[
            styles.themeSelectRow,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
          ]}
        >
          <View>
            <Text style={[styles.themeSelectTitle, { color: colors.ink }]}>
              {colors.name}
            </Text>
            <Text style={[styles.themeSelectMeta, { color: colors.muted }]}>
              Text {colors.contrastText} · Button {colors.contrastBtn}
            </Text>
          </View>
          <Text style={[styles.chev, { color: colors.muted }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Audio Preferences */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        <Text style={[styles.cardHeader, { color: colors.ink }]}>Hardware Controls</Text>

        <View style={styles.switchRow}>
          <View style={styles.switchLabelContainer}>
            <Text style={[styles.switchLabel, { color: colors.ink }]}>
              Volume Boost (150%)
            </Text>
            <Text style={[styles.switchDesc, { color: colors.muted }]}>
              GOODEV precedent audio amplifier for low-gain video/music
            </Text>
          </View>
          <Switch
            value={settings.volumeBoostEnabled}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, volumeBoostEnabled: val })
            }
            trackColor={{ false: colors.line, true: colors.accent }}
            thumbColor={colors.ink}
          />
        </View>

        <View style={[styles.switchRow, { borderTopWidth: 1, borderTopColor: colors.line }]}>
          <View style={styles.switchLabelContainer}>
            <Text style={[styles.switchLabel, { color: colors.ink }]}>
              Speaker Coil Protection
            </Text>
            <Text style={[styles.switchDesc, { color: colors.muted }]}>
              Soft-limit high frequencies to prevent hardware driver clipping
            </Text>
          </View>
          <Switch
            value={settings.safetyLimiter}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, safetyLimiter: val })
            }
            trackColor={{ false: colors.line, true: colors.accent }}
            thumbColor={colors.ink}
          />
        </View>

        <View style={[styles.switchRow, { borderTopWidth: 1, borderTopColor: colors.line }]}>
          <View style={styles.switchLabelContainer}>
            <Text style={[styles.switchLabel, { color: colors.ink }]}>
              Tactile Haptic Feedback
            </Text>
            <Text style={[styles.switchDesc, { color: colors.muted }]}>
              Mechanical motor pulses during tests and button taps
            </Text>
          </View>
          <Switch
            value={settings.hapticFeedbackEnabled}
            onValueChange={(val) =>
              onUpdateSettings({ ...settings, hapticFeedbackEnabled: val })
            }
            trackColor={{ false: colors.line, true: colors.accent }}
            thumbColor={colors.ink}
          />
        </View>
      </View>

      {/* Research Precedent Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
        ]}
      >
        <Text style={[styles.cardHeader, { color: colors.ink }]}>The GOODEV Precedent</Text>
        <Text style={[styles.infoParagraph, { color: colors.muted }]}>
          Built on the documented findings of Volume Booster GOODEV (50M+ Play Store
          downloads by a solo developer in Argentina). This toolkit adds full diagnostic
          frequency sweeps, earpiece testing, 165 Hz water expulsion, and Acid
          Minimalism contrast verification.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  header: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
  },
  themeSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeSelectTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  themeSelectMeta: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'Courier',
  },
  chev: {
    fontSize: 18,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  switchLabelContainer: {
    flex: 1,
    gap: 2,
  },
  switchLabel: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  switchDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  infoParagraph: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default React.memo(SettingsScreen);
