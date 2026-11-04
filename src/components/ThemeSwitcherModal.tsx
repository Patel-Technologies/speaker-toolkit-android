import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEMES } from '../theme';
import { ThemeColors, ThemeId } from '../types';

interface ThemeSwitcherModalProps {
  visible: boolean;
  currentThemeId: ThemeId;
  colors: ThemeColors;
  onSelectTheme: (id: ThemeId) => void;
  onClose: () => void;
}

const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({
  visible,
  currentThemeId,
  colors,
  onSelectTheme,
  onClose,
}) => {
  const themeList = Object.values(THEMES);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
        >
          <View style={styles.dragPill} />

          <View style={styles.titleRow}>
            <View>
              <Text style={[styles.title, { color: colors.ink }]}>Color Theory Lab</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Acid Minimalism & WCAG AAA Tested Palettes
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.doneBtn, { backgroundColor: colors.surfaceElevated }]}
            >
              <Text style={[styles.doneText, { color: colors.ink }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {themeList.map((t) => {
              const isSelected = t.id === currentThemeId;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    onSelectTheme(t.id);
                    onClose();
                  }}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                      borderColor: isSelected ? colors.accent : colors.line,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Select theme: ${t.name}`}
                >
                  <View style={styles.cardLeft}>
                    {/* Swatch Previews */}
                    <View style={styles.swatchStack}>
                      <View style={[styles.swatchBg, { backgroundColor: t.bg }]} />
                      <View style={[styles.swatchAccent, { backgroundColor: t.accent }]} />
                    </View>

                    <View style={styles.textContainer}>
                      <View style={styles.cardTitleRow}>
                        <Text style={[styles.themeTitle, { color: colors.ink }]}>
                          {t.name}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: `${colors.accent}30` }]}>
                          <Text style={[styles.badgeText, { color: colors.ink }]}>
                            {t.contrastText}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.metaText, { color: colors.muted }]}>
                        Btn: {t.contrastBtn} · {t.isDark ? 'Dark Canvas' : 'Light Canvas'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isSelected ? colors.accent : colors.muted,
                        backgroundColor: isSelected ? colors.accent : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    gap: 16,
    paddingBottom: 36,
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(127, 127, 127, 0.35)',
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  doneBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  doneText: {
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  swatchStack: {
    width: 36,
    height: 36,
    position: 'relative',
  },
  swatchBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  swatchAccent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  themeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  metaText: {
    fontSize: 10.5,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B090B',
  },
});

export default React.memo(ThemeSwitcherModal);
