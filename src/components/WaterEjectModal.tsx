import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';

interface WaterEjectModalProps {
  visible: boolean;
  colors: ThemeColors;
  progressPercent: number;
  isRunning: boolean;
  onStartEjection: () => void;
  onStopEjection: () => void;
  onClose: () => void;
}

const WaterEjectModal: React.FC<WaterEjectModalProps> = ({
  visible,
  colors,
  progressPercent,
  isRunning,
  onStartEjection,
  onStopEjection,
  onClose,
}) => {
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

          <View style={styles.iconCircle}>
            <Text style={styles.waterDropIcon}>💧</Text>
          </View>

          <Text style={[styles.title, { color: colors.ink }]}>165 Hz Water Ejector</Text>
          <Text style={[styles.desc, { color: colors.muted }]}>
            Generates low-frequency 165 Hz acoustic waves and mechanical resonance to dislodge
            moisture and particles trapped inside your phone speakers.
          </Text>

          {/* Progress Circle & Meter */}
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.ink }]}>
              {isRunning ? `Cleaning in progress... ${progressPercent}%` : 'Turn volume to 100% and place phone face-down'}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={isRunning ? onStopEjection : onStartEjection}
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={isRunning ? 'Stop water ejection' : 'Start water ejection cycle'}
          >
            <Text style={styles.actionBtnText}>
              {isRunning ? '⏹  Stop Cleaning' : '🌊  Start 165 Hz Ejection'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={styles.cancelBtn}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close water ejector modal"
          >
            <Text style={[styles.cancelText, { color: colors.muted }]}>Close</Text>
          </TouchableOpacity>
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
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(127, 127, 127, 0.35)',
    marginBottom: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterDropIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  meterContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    borderRadius: 99,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 99,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtn: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B090B',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default React.memo(WaterEjectModal);
