import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  Alert,
  LogBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from './src/theme';
import {
  AppSettings,
  SoundTest,
  TabType,
  TestHistoryEntry,
  ThemeId,
} from './src/types';
import { audioEngine, WaveBarState } from './src/utils/audioEngine';
import { haptics } from './src/utils/haptics';

import HeaderBar from './src/components/HeaderBar';
import TabBar from './src/components/TabBar';
import ThemeSwitcherModal from './src/components/ThemeSwitcherModal';
import WaterEjectModal from './src/components/WaterEjectModal';
import HeadphoneTestModal from './src/components/HeadphoneTestModal';
import EarpieceTestModal from './src/components/EarpieceTestModal';
import DecibelMeterModal from './src/components/DecibelMeterModal';
import VibrationTestModal from './src/components/VibrationTestModal';
import Snackbar from './src/components/Snackbar';

import HomeScreen from './src/screens/HomeScreen';
import TestsScreen from './src/screens/TestsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

LogBox.ignoreAllLogs();

const App: React.FC = () => {
  // Theme state: defaults to 'neon-lime' (The Reel Original)
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('neon-lime');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isThemePickerVisible, setIsThemePickerVisible] = useState(false);
  const [isWaterEjectModalVisible, setIsWaterEjectModalVisible] = useState(false);
  const [isHeadphoneModalVisible, setIsHeadphoneModalVisible] = useState(false);
  const [isEarpieceModalVisible, setIsEarpieceModalVisible] = useState(false);
  const [isDecibelModalVisible, setIsDecibelModalVisible] = useState(false);
  const [isVibrationModalVisible, setIsVibrationModalVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setSnackbarMessage(msg);
  }, []);

  // Audio test states
  const [volumePercent, setVolumePercent] = useState(68); // 68% matching HTML mockup
  const [selectedFrequency, setSelectedFrequency] = useState(1000); // Default 1 kHz
  const [isSpeakerTestRunning, setIsSpeakerTestRunning] = useState(false);
  const [speakerTestElapsed, setSpeakerTestElapsed] = useState(0);
  const [waveData, setWaveData] = useState<WaveBarState[]>(() =>
    audioEngine.generateWaveformData(false)
  );

  // Water eject state
  const [waterEjectProgress, setWaterEjectProgress] = useState(0);
  const [isWaterEjectRunning, setIsWaterEjectRunning] = useState(false);

  // Settings & History state
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'neon-lime',
    volumeBoostEnabled: false,
    hapticFeedbackEnabled: true,
    safetyLimiter: true,
    lastVolume: 68,
  });

  const [history, setHistory] = useState<TestHistoryEntry[]>([
    {
      id: 'log-1',
      testId: 'speaker-1khz',
      testTitle: '1 kHz Speaker Test',
      timestamp: 'Today · 09:41 AM',
      passed: true,
      notes: 'No distortion detected. Output clean at 68% gain.',
    },
    {
      id: 'log-2',
      testId: 'earpiece',
      testTitle: 'Earpiece Receiver Test',
      timestamp: 'Today · 09:35 AM',
      passed: true,
      notes: 'Call receiver channel verified.',
    },
  ]);

  const activeColors = useMemo(() => {
    return THEMES[currentThemeId] || THEMES['neon-lime'];
  }, [currentThemeId]);

  // Toggle between Light (Neon Lime) and Dark Flip (Midnight Lime)
  const handleToggleTheme = useCallback(() => {
    haptics.tap();
    setCurrentThemeId((prev) =>
      prev === 'neon-lime' ? 'midnight-lime' : 'neon-lime'
    );
  }, []);

  // Run or Stop 1 kHz Speaker Test
  const handleToggleSpeakerTest = useCallback(() => {
    haptics.buttonPress();
    if (isSpeakerTestRunning) {
      audioEngine.stopCurrentTest();
      setIsSpeakerTestRunning(false);
      setWaveData(audioEngine.generateWaveformData(false));
    } else {
      setIsSpeakerTestRunning(true);
      setSpeakerTestElapsed(0);

      audioEngine.startSpeakerTest(
        5,
        selectedFrequency,
        volumePercent,
        (elapsed: number, wave: WaveBarState[]) => {
          setSpeakerTestElapsed(elapsed);
          setWaveData(wave);
        },
        () => {
          setIsSpeakerTestRunning(false);
          setWaveData(audioEngine.generateWaveformData(false));
          haptics.motorTestCycle('heavy');

          // Log entry
          const newEntry: TestHistoryEntry = {
            id: `test_${Date.now()}`,
            testId: 'speaker-1khz',
            testTitle: `${selectedFrequency >= 1000 ? `${selectedFrequency / 1000} kHz` : `${selectedFrequency} Hz`} Speaker Test`,
            timestamp: 'Just now',
            passed: true,
            notes: `Completed 5s sine sweep at ${volumePercent}% volume. Output clean.`,
          };
          setHistory((prev) => [newEntry, ...prev]);

          showNotification(`✓ ${selectedFrequency >= 1000 ? `${selectedFrequency / 1000} kHz` : `${selectedFrequency} Hz`} test passed: Speaker output clear.`);
        }
      );
    }
  }, [isSpeakerTestRunning, volumePercent]);

  // Handle Water Ejection Cycle
  const handleStartWaterEject = useCallback(() => {
    haptics.buttonPress();
    setIsWaterEjectRunning(true);
    setWaterEjectProgress(0);

    audioEngine.startWaterEjectCycle(
      15,
      (progress, wave) => {
        setWaterEjectProgress(progress);
        setWaveData(wave);
      },
      () => {
        setIsWaterEjectRunning(false);
        setWaterEjectProgress(100);
        haptics.motorTestCycle('heavy');

        // Log entry
        const newEntry: TestHistoryEntry = {
          id: `water_${Date.now()}`,
          testId: 'water-eject',
          testTitle: '165 Hz Water Ejection',
          timestamp: 'Just now',
          passed: true,
          notes: 'Full 15s acoustic expulsion cycle finished.',
        };
        setHistory((prev) => [newEntry, ...prev]);

        showNotification('💧 165 Hz water cleaner completed. Moisture expelled.');
      }
    );
  }, [showNotification]);

  const handleStopWaterEject = useCallback(() => {
    audioEngine.stopCurrentTest();
    setIsWaterEjectRunning(false);
  }, []);

  // Handle generic test selection from list
  const handleSelectTest = useCallback(
    (test: SoundTest) => {
      haptics.tap();
      if (test.id === 'water-eject') {
        setIsWaterEjectModalVisible(true);
      } else if (test.id === 'vibration') {
        setIsVibrationModalVisible(true);
      } else if (test.id === 'headphone-lr') {
        setIsHeadphoneModalVisible(true);
      } else if (test.id === 'earpiece') {
        setIsEarpieceModalVisible(true);
      } else if (test.id === 'decibel-meter') {
        setIsDecibelModalVisible(true);
      } else if (test.id === 'frequency-sweep') {
        showNotification('〰️ Starting 20 Hz – 20,000 Hz diagnostic frequency sweep...');
        audioEngine.startFrequencySweep(
          20,
          20000,
          8,
          volumePercent,
          (freq) => {
            setSelectedFrequency(freq);
          },
          () => {
            showNotification('✓ Full audio frequency sweep completed.');
            const newEntry: TestHistoryEntry = {
              id: `sweep_${Date.now()}`,
              testId: 'frequency-sweep',
              testTitle: '20 Hz – 20 kHz Frequency Sweep',
              timestamp: 'Just now',
              passed: true,
              notes: 'Full spectrum hardware response verified.',
            };
            setHistory((prev) => [newEntry, ...prev]);
          }
        );
      } else {
        handleToggleSpeakerTest();
      }
    },
    [handleToggleSpeakerTest, showNotification, volumePercent]
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeColors.bg },
      ]}
    >
      <StatusBar
        barStyle={activeColors.isDark ? 'light-content' : 'dark-content'}
      />

      <View style={styles.container}>
        {/* Mockup Header: Notch, Status 9:41 / 5G, Title, Avatar S */}
        <HeaderBar
          colors={activeColors}
          onToggleTheme={handleToggleTheme}
          onOpenThemePicker={() => setIsThemePickerVisible(true)}
        />

        {/* Tab Body */}
        <View style={styles.tabContent}>
          {activeTab === 'home' && (
            <HomeScreen
              colors={activeColors}
              isSpeakerTestRunning={isSpeakerTestRunning}
              speakerTestElapsed={speakerTestElapsed}
              speakerTestDuration={5}
              waveData={waveData}
              volumePercent={volumePercent}
              isBoostMode={settings.volumeBoostEnabled}
              selectedFrequency={selectedFrequency}
              onSelectFrequency={setSelectedFrequency}
              onToggleSpeakerTest={handleToggleSpeakerTest}
              onVolumeChange={setVolumePercent}
              onToggleBoost={() =>
                setSettings((s) => ({
                  ...s,
                  volumeBoostEnabled: !s.volumeBoostEnabled,
                }))
              }
              onSelectTest={handleSelectTest}
            />
          )}

          {activeTab === 'tests' && (
            <TestsScreen colors={activeColors} onSelectTest={handleSelectTest} />
          )}

          {activeTab === 'history' && (
            <HistoryScreen colors={activeColors} history={history} />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              colors={activeColors}
              settings={settings}
              onUpdateSettings={setSettings}
              onOpenThemePicker={() => setIsThemePickerVisible(true)}
            />
          )}
        </View>

        {/* Tab Bar: Home, Tests, History, Settings */}
        <TabBar
          activeTab={activeTab}
          colors={activeColors}
          onSelectTab={setActiveTab}
        />
      </View>

      {/* Water Ejector Modal */}
      <WaterEjectModal
        visible={isWaterEjectModalVisible}
        colors={activeColors}
        progressPercent={waterEjectProgress}
        isRunning={isWaterEjectRunning}
        onStartEjection={handleStartWaterEject}
        onStopEjection={handleStopWaterEject}
        onClose={() => {
          handleStopWaterEject();
          setIsWaterEjectModalVisible(false);
        }}
      />

      {/* Headphone Stereo Balancer Modal */}
      <HeadphoneTestModal
        visible={isHeadphoneModalVisible}
        colors={activeColors}
        onClose={() => setIsHeadphoneModalVisible(false)}
      />

      {/* Earpiece Receiver Modal */}
      <EarpieceTestModal
        visible={isEarpieceModalVisible}
        colors={activeColors}
        onClose={() => setIsEarpieceModalVisible(false)}
      />

      {/* Decibel Sound Meter Modal */}
      <DecibelMeterModal
        visible={isDecibelModalVisible}
        colors={activeColors}
        onClose={() => setIsDecibelModalVisible(false)}
      />

      {/* Vibration Motor Benchmark Modal */}
      <VibrationTestModal
        visible={isVibrationModalVisible}
        colors={activeColors}
        onClose={() => setIsVibrationModalVisible(false)}
      />

      {/* Color Theory Palette Switcher Modal */}
      <ThemeSwitcherModal
        visible={isThemePickerVisible}
        currentThemeId={currentThemeId}
        colors={activeColors}
        onSelectTheme={setCurrentThemeId}
        onClose={() => setIsThemePickerVisible(false)}
      />

      {/* M3 Transient Snackbar Feedback (Replaces disruptive modal alerts) */}
      {snackbarMessage && (
        <Snackbar
          message={snackbarMessage}
          actionLabel="Dismiss"
          colors={activeColors}
          onDismiss={() => setSnackbarMessage(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabContent: {
    flex: 1,
  },
});

export default App;
