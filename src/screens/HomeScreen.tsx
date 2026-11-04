import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SoundTest, ThemeColors } from '../types';
import { WaveBarState } from '../utils/audioEngine';
import HeroTestCard from '../components/HeroTestCard';
import VolumeSliderRow from '../components/VolumeSliderRow';
import TestRowItem from '../components/TestRowItem';
import { TOOLKIT_TESTS } from '../data/tests';

interface HomeScreenProps {
  colors: ThemeColors;
  isSpeakerTestRunning: boolean;
  speakerTestElapsed: number;
  speakerTestDuration: number;
  waveData: WaveBarState[];
  volumePercent: number;
  isBoostMode: boolean;
  onToggleSpeakerTest: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleBoost: () => void;
  onSelectTest: (test: SoundTest) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  colors,
  isSpeakerTestRunning,
  speakerTestElapsed,
  speakerTestDuration,
  waveData,
  volumePercent,
  isBoostMode,
  onToggleSpeakerTest,
  onVolumeChange,
  onToggleBoost,
  onSelectTest,
}) => {
  // 4 primary headline tests shown on Home matching the HTML mockup
  const homeTests = TOOLKIT_TESTS.filter(
    (t) =>
      t.id === 'earpiece' ||
      t.id === 'headphone-lr' ||
      t.id === 'vibration' ||
      t.id === 'water-eject'
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Card: 1 kHz Test Tone (Exact Replica of HTML Mockup) */}
      <HeroTestCard
        colors={colors}
        isRunning={isSpeakerTestRunning}
        elapsedTime={speakerTestElapsed}
        duration={speakerTestDuration}
        waveData={waveData}
        onToggleTest={onToggleSpeakerTest}
      />

      {/* Volume Slider Row: VOL, 68% (Exact Replica of HTML Mockup) */}
      <VolumeSliderRow
        colors={colors}
        volumePercent={volumePercent}
        onVolumeChange={onVolumeChange}
        isBoostMode={isBoostMode}
        onToggleBoost={onToggleBoost}
      />

      {/* Tests List Rows (Exact Replica of HTML Mockup .test-row) */}
      <View
        style={[
          styles.testsContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.line,
          },
        ]}
      >
        {homeTests.map((test, index) => (
          <TestRowItem
            key={test.id}
            test={test}
            colors={colors}
            isLast={index === homeTests.length - 1}
            onPress={onSelectTest}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 10,
    gap: 4,
  },
  testsContainer: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginTop: 4,
  },
});

export default React.memo(HomeScreen);
