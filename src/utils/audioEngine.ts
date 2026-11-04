import { haptics } from './haptics';

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
    const time = Date.now() / 150;

    return Array.from({ length: 12 }, (_, i) => {
      const harmonic = Math.sin(time + i * 0.6) * 0.4 + 0.6;
      const height = Math.min(100, Math.max(20, Math.round(harmonic * 95 * volScale)));
      const isHot = height >= 75 || i === 2 || i === 4 || i === 6 || i === 9;
      return { heightPercent: height, isHot };
    });
  }

  // Run Speaker Test Tone
  startSpeakerTest(
    durationSeconds: number,
    frequency: number = 1000,
    onTick: (elapsed: number, wave: WaveBarState[]) => void,
    onComplete: () => void
  ) {
    this.stopCurrentTest();
    this.isPlaying = true;
    this.currentFrequency = frequency;
    let elapsed = 0;

    haptics.testRunningPulse();

    this.activeTestTimer = setInterval(() => {
      elapsed += 0.1;
      const wave = this.generateWaveformData(true, frequency, 75);
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

  // Water Ejection 165Hz Acoustic Burst Cycle
  startWaterEjectCycle(
    durationSeconds: number,
    onProgress: (percent: number, wave: WaveBarState[]) => void,
    onComplete: () => void
  ) {
    this.stopCurrentTest();
    this.isPlaying = true;
    let elapsed = 0;

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
    haptics.stop();
  }

  isTestRunning(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
