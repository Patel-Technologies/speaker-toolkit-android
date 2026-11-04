import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../types';

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  colors: ThemeColors;
  onAction?: () => void;
  onDismiss: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  actionLabel = 'Dismiss',
  colors,
  onAction,
  onDismiss,
}) => {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.isDark ? '#2A272A' : '#1A181A',
            borderTopColor: 'rgba(255, 255, 255, 0.18)', // Lit edge
          },
        ]}
      >
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity
          onPress={() => {
            if (onAction) onAction();
            onDismiss();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.actionBtn}
          accessible
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.actionText, { color: colors.accent }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 74, // floats cleanly above sticky tab bar
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12, // M3 medium shape
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    gap: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FAF8F3',
    lineHeight: 18,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default React.memo(Snackbar);
