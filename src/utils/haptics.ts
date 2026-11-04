import { Vibration, Platform } from 'react-native';

export const haptics = {
  tap: () => {
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate(15);
      } else {
        Vibration.vibrate(10);
      }
    } catch {
      // safe fallback
    }
  },

  buttonPress: () => {
    try {
      Vibration.vibrate(25);
    } catch {
      // safe fallback
    }
  },

  testRunningPulse: () => {
    try {
      // Soft recurring rhythm during test
      Vibration.vibrate([0, 40, 100, 40]);
    } catch {
      // safe fallback
    }
  },

  waterEjectionPulse: () => {
    try {
      // 165Hz physical mechanical resonance burst sequence
      Vibration.vibrate([0, 120, 60, 150, 60, 200, 80, 250]);
    } catch {
      // safe fallback
    }
  },

  motorTestCycle: (stage: 'light' | 'medium' | 'heavy' | 'heartbeat') => {
    try {
      switch (stage) {
        case 'light':
          Vibration.vibrate(20);
          break;
        case 'medium':
          Vibration.vibrate(60);
          break;
        case 'heavy':
          Vibration.vibrate(150);
          break;
        case 'heartbeat':
          Vibration.vibrate([0, 40, 80, 70]);
          break;
      }
    } catch {
      // safe fallback
    }
  },

  stop: () => {
    try {
      Vibration.cancel();
    } catch {
      // safe fallback
    }
  },
};
