import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { haptics } from '../utils/haptics';

interface HeadphoneTestModalProps {
  visible: boolean;
  colors: ThemeColors;
  onClose: () => void;
}

const HeadphoneTestModal: React.FC<HeadphoneTestModalProps> = ({
  visible,
  colors,
  onClose,
}) => {
  const [activeChannel, setActiveChannel] = useState<'left' | 'right' | 'both' | null>(null);

  const handleTestChannel = (channel: 'left' | 'right' | 'both') => {
    setActiveChannel(channel);
    haptics.buttonPress();

    const pan = channel === 'left' ? -1.0 : channel === 'right' ? 1.0 : 0.0;
    audioEngine.playRawTone(1000, 80, pan, 'speaker');

    setTimeout(() => {
      audioEngine.stopCurrentTest();
      setActiveChannel(null);
    }, 2500);
  };

  const handleStop = () => {
    audioEngine.stopCurrentTest();
    setActiveChannel(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.dragPill, { backgroundColor: colors.lineStrong }]} />
            <Text style={[styles.title, { color: colors.ink }]}>Stereo Channel Balancer</Text>
            <Text style={[styles.sub, { color: colors.ink }]}>
              Verify Left & Right driver phase isolation
            </Text>
          </View>

          {/* Visual Headphone Diagram */}
          <View style={styles.diagramContainer}>
            {/* Left Ear Cup */}
            <TouchableOpacity
              onPress={() => handleTestChannel('left')}
              style={[
                styles.earCup,
                {
                  backgroundColor: activeChannel === 'left' ? colors.accent : colors.surfaceElevated,
                  borderColor: activeChannel === 'left' ? colors.lineStrong : colors.line,
                },
              ]}
            >
              <Text style={[styles.earCupLetter, { color: activeChannel === 'left' ? '#0B090B' : colors.ink }]}>
                L
              </Text>
              <Text style={[styles.earCupSub, { color: activeChannel === 'left' ? '#0B090B' : colors.ink }]}>
                Left Ear
              </Text>
            </TouchableOpacity>

            {/* Bridge */}
            <View style={[styles.bridge, { borderColor: colors.line }]} />

            {/* Right Ear Cup */}
            <TouchableOpacity
              onPress={() => handleTestChannel('right')}
              style={[
                styles.earCup,
                {
                  backgroundColor: activeChannel === 'right' ? colors.accent : colors.surfaceElevated,
                  borderColor: activeChannel === 'right' ? colors.lineStrong : colors.line,
                },
              ]}
            >
              <Text style={[styles.earCupLetter, { color: activeChannel === 'right' ? '#0B090B' : colors.ink }]}>
                R
              </Text>
              <Text style={[styles.earCupSub, { color: activeChannel === 'right' ? '#0B090B' : colors.ink }]}>
                Right Ear
              </Text>
            </TouchableOpacity>
          </View>

          {/* Channel Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => handleTestChannel('left')}
              style={[
                styles.channelBtn,
                {
                  backgroundColor: activeChannel === 'left' ? colors.accent : colors.surfaceElevated,
                  borderColor: colors.line,
                },
              ]}
            >
              <Text style={[styles.channelBtnText, { color: activeChannel === 'left' ? '#0B090B' : colors.ink }]}>
                ◀ Play Left
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTestChannel('both')}
              style={[
                styles.channelBtn,
                {
                  backgroundColor: activeChannel === 'both' ? colors.accent : colors.surfaceElevated,
                  borderColor: colors.line,
                },
              ]}
            >
              <Text style={[styles.channelBtnText, { color: activeChannel === 'both' ? '#0B090B' : colors.ink }]}>
                ● Stereo Both
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTestChannel('right')}
              style={[
                styles.channelBtn,
                {
                  backgroundColor: activeChannel === 'right' ? colors.accent : colors.surfaceElevated,
                  borderColor: colors.line,
                },
              ]}
            >
              <Text style={[styles.channelBtnText, { color: activeChannel === 'right' ? '#0B090B' : colors.ink }]}>
                Play Right ▶
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status Hint */}
          <Text style={[styles.hint, { color: colors.ink }]}>
            {activeChannel
              ? `🔊 Playing 1 kHz tone through ${activeChannel.toUpperCase()} channel...`
              : 'Tap Left or Right to ensure both sides sound identical in volume and tone.'}
          </Text>

          {/* Close button */}
          <TouchableOpacity
            onPress={() => {
              handleStop();
              onClose();
            }}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.line }]}
          >
            <Text style={[styles.closeBtnText, { color: colors.ink }]}>Close Test</Text>
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
  },
  diagramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  earCup: {
    width: 90,
    height: 110,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  earCupLetter: {
    fontSize: 32,
    fontWeight: '900',
  },
  earCupSub: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  bridge: {
    width: 60,
    height: 12,
    borderTopWidth: 3,
    borderBottomWidth: 0,
    marginHorizontal: -4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  hint: {
    fontSize: 11.5,
    textAlign: 'center',
    opacity: 0.75,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 4,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default React.memo(HeadphoneTestModal);
