import { NativeModules } from 'react-native';
import { haptics } from './haptics';

const { AudioToneModule } = NativeModules;

export interface WaveBarState {
  heightPercent: number;
  isHot: boolean;
}

class AudioEngine {
  private activeTestTimer: ReturnType<typeof setInterval> | null = null;
  private currentFrequency: number = 1000; // default 1 kHz
  private isPlaying: boolean = false;

  // Real-time audio waveform generator with 12 bars (matching HTML mockup)
  generateWaveformData(
    isActive: boolean,
    frequency: number = 1000,
    volumePercent: number = 68
  ): WaveBarState[] {
    if (!isActive) {
      // Idle state matching HTML mockup baseline
      return [
        { heightPercent: 35, isHot: false },
        { heightPercent: 55, isHot: false },
        { heightPercent: 80, isHot: true },
        { heightPercent: 60, isHot: false },
        { heightPercent: 100, isHot: true },
        { heightPercent: 70, isHot: false },
        { heightPercent: 90, isHot: true },
        { heightPercent: 45, isHot: false },
        { heightPercent: 65, isHot: false },
        { heightPercent: 85, isHot: true },
        { heightPercent: 50, isHot: false },
        { heightPercent: 38, isHot: false },
      ];
    }

    // Dynamic wave modulation based on frequency & volume
    const volScale = Math.max(0.2, volumePercent / 100);
    const speed = Math.min(300, Math.max(50, frequency / 10));
    const time = Date.now() / speed;

    return Array.from({ length: 12 }, (_, i) => {
      const harmonic = Math.sin(time + i * 0.6) * 0.4 + 0.6;
      const height = Math.min(100, Math.max(20, Math.round(harmonic * 95 * volScale)));
      const isHot = height >= 75 || i === 2 || i === 4 || i === 6 || i === 9;
      return { heightPercent: height, isHot };
    });
  }

  // Run Speaker Test Tone with real audible PCM generation
  startSpeakerTest(
    durationSeconds: number,
    frequency: number = 1000,
    volumePercent: number = 75,
    onTick: (elapsed: number, wave: WaveBarState[]) => void,
    onComplete: () => void
  ) {
    this.stopCurrentTest();
    this.isPlaying = true;
    this.currentFrequency = frequency;
    let elapsed = 0;

    // Trigger REAL audible PCM sound
    if (AudioToneModule?.playTone) {
      AudioToneModule.playTone(frequency, volumePercent / 100, 0.0, 'speaker').catch(() => {});
    }

    haptics.testRunningPulse();

    this.activeTestTimer = setInterval(() => {
      elapsed += 0.1;
      const wave = this.generateWaveformData(true, frequency, volumePercent);
      onTick(Math.min(elapsed, durationSeconds), wave);

      if (Math.round(elapsed * 10) % 10 === 0) {
        haptics.tap();
      }

      if (elapsed >= durationSeconds) {
        this.stopCurrentTest();
        onComplete();
      }
    }, 100);
  }

  // Play continuous or custom test tone (e.g. for stereo or frequency slider)
  playRawTone(frequency: number, volumePercent: number = 80, pan: number = 0.0, stream: string = 'speaker') {
    this.stopCurrentTest();
    this.isPlaying = true;
    this.currentFrequency = frequency;

    if (AudioToneModule?.playTone) {
      AudioToneModule.playTone(frequency, volumePercent / 100, pan, stream).catch(() => {});
    }
    haptics.testRunningPulse();
  }

  // Start full audio spectrum sweep from startFreq to endFreq
  startFrequencySweep(
    startFreq: number = 20,
    endFreq: number = 20000,
    durationSeconds: number = 8,
    volumePercent: number = 75,
    onStep: (freq: number) => void,
    onComplete: () => void
  ) {
    this.stopCurrentTest();
    this.isPlaying = true;
    const steps = durationSeconds * 10;
    let currentStep = 0;

    this.activeTestTimer = setInterval(() => {
      currentStep++;
      // Exponential sweep: f(t) = start * (end/start)^(t/T)
      const ratio = currentStep / steps;
      const freq = Math.round(startFreq * Math.pow(endFreq / startFreq, ratio));
      onStep(freq);

      if (AudioToneModule?.playTone) {
        AudioToneModule.playTone(freq, volumePercent / 100, 0.0, 'speaker').catch(() => {});
      }

      if (currentStep >= steps) {
        this.stopCurrentTest();
        onComplete();
      }
    }, 100);
  }

  // Water Ejection 165Hz Acoustic Burst Cycle with REAL 165 Hz sound
  startWaterEjectCycle(
    durationSeconds: number,
    onProgress: (percent: number, wave: WaveBarState[]) => void,
    onComplete: () => void
  ) {
    this.stopCurrentTest();
    this.isPlaying = true;
    let elapsed = 0;

    // Start 165 Hz ultrasonic expulsion tone
    if (AudioToneModule?.playTone) {
      AudioToneModule.playTone(165.0, 1.0, 0.0, 'speaker').catch(() => {});
    }

    this.activeTestTimer = setInterval(() => {
      elapsed += 0.15;
      const progress = Math.min(100, Math.round((elapsed / durationSeconds) * 100));
      const wave = this.generateWaveformData(true, 165, 100);

      haptics.waterEjectionPulse();
      onProgress(progress, wave);

      if (elapsed >= durationSeconds) {
        this.stopCurrentTest();
        onComplete();
      }
    }, 150);
  }

  // Stop any active audio test
  stopCurrentTest() {
    if (this.activeTestTimer) {
      clearInterval(this.activeTestTimer);
      this.activeTestTimer = null;
    }
    this.isPlaying = false;

    if (AudioToneModule?.stopTone) {
      AudioToneModule.stopTone().catch(() => {});
    }
    haptics.stop();
  }

  isTestRunning(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
