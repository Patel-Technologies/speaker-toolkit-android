import { SoundTest } from '../types';

export const TOOLKIT_TESTS: SoundTest[] = [
  {
    id: 'speaker-1khz',
    title: 'Speaker test',
    subtitle: 'Test tone · 1 kHz diagnostic',
    icon: '🔊',
    durationSeconds: 5,
    category: 'core',
    description:
      'Plays a calibrated 1,000 Hz acoustic reference tone through the primary loudspeaker to check for crackle, distortion, or blown voice coils.',
  },
  {
    id: 'earpiece',
    title: 'Earpiece test',
    subtitle: 'Call speaker output',
    icon: '📞',
    durationSeconds: 4,
    category: 'hardware',
    description:
      'Routes diagnostic audio through the top in-call earpiece receiver to verify phone call clarity and secondary transducer volume.',
  },
  {
    id: 'headphone-lr',
    title: 'Headphone test',
    subtitle: 'Left / right channels',
    icon: '🎧',
    durationSeconds: 6,
    category: 'hardware',
    description:
      'Sweeps alternating stereo signals across the Left and Right audio channels to detect channel imbalance or crosstalk in connected headphones.',
  },
  {
    id: 'vibration',
    title: 'Vibration test',
    subtitle: 'Motor strength check',
    icon: '📳',
    durationSeconds: 5,
    category: 'hardware',
    description:
      'Executes sequential haptic pulses (Gentle, Medium, Heavy, Heartbeat) to benchmark the phone haptic motor frequency and tactile response.',
  },
  {
    id: 'water-eject',
    title: 'Water Ejector',
    subtitle: '165 Hz acoustic water cleaner',
    icon: '💧',
    durationSeconds: 15,
    category: 'cleaning',
    description:
      'Emits low-frequency 165 Hz acoustic pressure pulses and resonant mechanical vibrations to expel trapped moisture and dust from the speaker grille.',
  },
  {
    id: 'decibel-meter',
    title: 'Sound Meter',
    subtitle: 'Decibel (dB) noise monitor',
    icon: '🎙️',
    durationSeconds: 10,
    category: 'diagnostics',
    description:
      'Monitors real-time ambient sound levels using the microphone, displaying current dB, peak levels, and OSHA hearing safety categories.',
  },
  {
    id: 'frequency-sweep',
    title: 'Frequency Sweep',
    subtitle: '20 Hz – 20,000 Hz tone generator',
    icon: '〰️',
    durationSeconds: 8,
    category: 'diagnostics',
    description:
      'Sweeps the complete audible spectrum from sub-bass (20 Hz) through midrange to treble (20 kHz) to test hardware frequency response limits.',
  },
];
