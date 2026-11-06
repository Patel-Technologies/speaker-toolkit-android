import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { haptics } from '../utils/haptics';

interface EarpieceTestModalProps {
  visible: boolean;
  colors: ThemeColors;
  onClose: () => void;
}

const EarpieceTestModal: React.FC<EarpieceTestModalProps> = ({
  visible,
  colors,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    haptics.buttonPress();
    if (isPlaying) {
      audioEngine.stopCurrentTest();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Route 800 Hz voice-band tone to top in-call earpiece speaker
      audioEngine.playRawTone(800, 85, 0.0, 'earpiece');
    }
  };

  const handleClose = () => {
    audioEngine.stopCurrentTest();
    setIsPlaying(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.dragPill, { backgroundColor: colors.lineStrong }]} />
            <Text style={[styles.title, { color: colors.ink }]}>Earpiece Call Speaker Test</Text>
            <Text style={[styles.sub, { color: colors.ink }]}>
              Diagnoses the top receiver speaker used during phone calls
            </Text>
          </View>

          {/* Visual Phone Illustration */}
          <View style={styles.phoneDiagram}>
            <View style={[styles.phoneShell, { backgroundColor: colors.surfaceElevated, borderColor: colors.line }]}>
              {/* Earpiece Grill */}
              <View
                style={[
                  styles.earpieceGrill,
                  {
                    backgroundColor: isPlaying ? colors.accent : colors.lineStrong,
                    borderColor: isPlaying ? colors.accent : 'transparent',
                  },
                ]}
              />

              {isPlaying && (
                <View style={styles.wavesRow}>
                  <Text style={[styles.soundWaveIcon, { color: colors.accent }]}>)))</Text>
                </View>
              )}

              <Text style={[styles.phoneLabel, { color: colors.ink }]}>
                {isPlaying ? '🔊 Earpiece Active' : 'Hold phone to your ear'}
              </Text>
            </View>
          </View>

          {/* Warning / Instructions Card */}
          <View style={[styles.guideBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.line }]}>
            <Text style={[styles.guideText, { color: colors.ink }]}>
              💡 This test routes voice-frequency audio exclusively to the top front earpiece receiver (not the main bottom loudspeaker).
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleToggle}
            style={[
              styles.actionBtn,
              { backgroundColor: isPlaying ? '#EF4444' : colors.accent },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: isPlaying ? '#FFFFFF' : '#0B090B' }]}>
              {isPlaying ? '⏹  Stop Earpiece Test' : '▶  Start Earpiece Tone'}
            </Text>
          </TouchableOpacity>

          {/* Close button */}
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.line }]}
          >
            <Text style={[styles.closeBtnText, { color: colors.ink }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  dragPill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    opacity: 0.4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  phoneDiagram: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  phoneShell: {
    width: 170,
    height: 120,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    paddingTop: 14,
    gap: 10,
    elevation: 3,
  },
  earpieceGrill: {
    width: 50,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  wavesRow: {
    position: 'absolute',
    top: 30,
  },
  soundWaveIcon: {
    fontSize: 18,
    fontWeight: '900',
    transform: [{ rotate: '-90deg' }],
  },
  phoneLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 20,
  },
  guideBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  guideText: {
    fontSize: 11.5,
    lineHeight: 16,
    opacity: 0.85,
    textAlign: 'center',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default React.memo(EarpieceTestModal);
