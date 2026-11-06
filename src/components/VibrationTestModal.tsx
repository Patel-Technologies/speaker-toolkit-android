import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeColors } from '../types';
import { haptics } from '../utils/haptics';

interface VibrationTestModalProps {
  visible: boolean;
  colors: ThemeColors;
  onClose: () => void;
}

type MotorPattern = 'light' | 'medium' | 'heavy' | 'heartbeat';

const PATTERNS: { id: MotorPattern; label: string; desc: string; icon: string; freq: string }[] = [
  { id: 'light', label: 'Gentle Tick', desc: 'Transient subtle impulse (UI click)', icon: '🟢', freq: '170 Hz · 15ms' },
  { id: 'medium', label: 'Medium Buzz', desc: 'Standard haptic confirmation', icon: '🟡', freq: '150 Hz · 40ms' },
  { id: 'heavy', label: 'Heavy Rumble', desc: 'High-amplitude resonant vibration', icon: '🟠', freq: '130 Hz · 90ms' },
  { id: 'heartbeat', label: 'Heartbeat Rhythm', desc: 'Dual rhythmic syncopated pulse', icon: '💓', freq: '60 BPM · Dual' },
];

const VibrationTestModal: React.FC<VibrationTestModalProps> = ({
  visible,
  colors,
  onClose,
}) => {
  const [activePattern, setActivePattern] = useState<MotorPattern | null>(null);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [completedPatterns, setCompletedPatterns] = useState<Set<MotorPattern>>(new Set());

  const triggerPattern = (pattern: MotorPattern) => {
    setActivePattern(pattern);
    haptics.motorTestCycle(pattern);
    setCompletedPatterns((prev) => new Set(prev).add(pattern));

    setTimeout(() => {
      setActivePattern(null);
    }, 450);
  };

  const handleRunAll = () => {
    if (isRunningAll) return;
    setIsRunningAll(true);
    setCompletedPatterns(new Set());

    // Step 1: Light
    setActivePattern('light');
    haptics.motorTestCycle('light');
    setCompletedPatterns((prev) => new Set(prev).add('light'));

    // Step 2: Medium
    setTimeout(() => {
      setActivePattern('medium');
      haptics.motorTestCycle('medium');
      setCompletedPatterns((prev) => new Set(prev).add('medium'));
    }, 600);

    // Step 3: Heavy
    setTimeout(() => {
      setActivePattern('heavy');
      haptics.motorTestCycle('heavy');
      setCompletedPatterns((prev) => new Set(prev).add('heavy'));
    }, 1300);

    // Step 4: Heartbeat
    setTimeout(() => {
      setActivePattern('heartbeat');
      haptics.motorTestCycle('heartbeat');
      setCompletedPatterns((prev) => new Set(prev).add('heartbeat'));
    }, 2200);

    // Finished
    setTimeout(() => {
      setActivePattern(null);
      setIsRunningAll(false);
    }, 3200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.dragPill, { backgroundColor: colors.lineStrong }]} />
            <Text style={[styles.title, { color: colors.ink }]}>Vibration Motor Benchmark</Text>
            <Text style={[styles.sub, { color: colors.ink }]}>
              Test LRA / ERM linear resonant haptic actuator strength
            </Text>
          </View>

          {/* Dynamic Graphic Center Card */}
          <View
            style={[
              styles.centerDisplay,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
            ]}
          >
            <View
              style={[
                styles.pulseRing,
                {
                  borderColor: activePattern ? colors.accent : colors.line,
                  transform: [{ scale: activePattern ? 1.08 : 1.0 }],
                  backgroundColor: activePattern ? `${colors.accent}15` : 'transparent',
                },
              ]}
            >
              <Text style={styles.motorIcon}>📳</Text>
            </View>
            <Text style={[styles.centerStatus, { color: colors.ink }]}>
              {activePattern
                ? `Firing: ${PATTERNS.find((p) => p.id === activePattern)?.label}`
                : isRunningAll
                ? 'Running Sequential Diagnostic...'
                : 'Ready · Select pattern or run benchmark'}
            </Text>
          </View>

          {/* 4 Pattern Interactive List */}
          <View style={styles.patternsContainer}>
            {PATTERNS.map((p) => {
              const isActive = activePattern === p.id;
              const isTested = completedPatterns.has(p.id);

              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => triggerPattern(p.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.patternCard,
                    {
                      backgroundColor: isActive ? colors.accent : colors.surfaceElevated,
                      borderColor: isActive ? colors.lineStrong : colors.line,
                    },
                  ]}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Test ${p.label} vibration pattern`}
                >
                  <Text style={styles.patternIcon}>{p.icon}</Text>
                  <View style={styles.patternInfo}>
                    <Text
                      style={[
                        styles.patternTitle,
                        { color: isActive ? '#0B090B' : colors.ink },
                      ]}
                    >
                      {p.label}
                    </Text>
                    <Text
                      style={[
                        styles.patternDesc,
                        { color: isActive ? '#0B090B' : colors.muted },
                      ]}
                    >
                      {p.desc}
                    </Text>
                  </View>
                  <View style={styles.badgeWrapper}>
                    <Text
                      style={[
                        styles.patternFreq,
                        {
                          color: isActive ? '#0B090B' : colors.muted,
                          borderColor: isActive ? '#0B090B' : colors.line,
                        },
                      ]}
                    >
                      {p.freq}
                    </Text>
                    {isTested && (
                      <Text style={[styles.checkBadge, { color: isActive ? '#0B090B' : colors.pass }]}>
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleRunAll}
              disabled={isRunningAll}
              style={[
                styles.primaryBtn,
                { backgroundColor: isRunningAll ? colors.surfaceElevated : colors.accent },
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Run all vibration patterns benchmark"
            >
              <Text style={[styles.primaryBtnText, { color: isRunningAll ? colors.muted : '#0B090B' }]}>
                {isRunningAll ? '⏳  Benchmarking Motor...' : '⚡  Run Full 4-Stage Benchmark'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { borderColor: colors.line }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Close vibration test"
            >
              <Text style={[styles.closeBtnText, { color: colors.ink }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 13,
    fontWeight: '600',
  },
  centerDisplay: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  pulseRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motorIcon: {
    fontSize: 28,
  },
  centerStatus: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  patternsContainer: {
    gap: 8,
  },
  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  patternIcon: {
    fontSize: 20,
  },
  patternInfo: {
    flex: 1,
    gap: 2,
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  patternDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patternFreq: {
    fontSize: 10.5,
    fontWeight: '700',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  checkBadge: {
    fontSize: 14,
    fontWeight: '900',
  },
  buttonRow: {
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default React.memo(VibrationTestModal);
