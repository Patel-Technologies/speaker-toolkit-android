import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SoundTest, ThemeColors } from '../types';
import TestRowItem from '../components/TestRowItem';
import { TOOLKIT_TESTS } from '../data/tests';

interface TestsScreenProps {
  colors: ThemeColors;
  onSelectTest: (test: SoundTest) => void;
}

const TestsScreen: React.FC<TestsScreenProps> = ({ colors, onSelectTest }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Hardware Diagnostics</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          Complete acoustic transducer, driver & sensor testing suite
        </Text>
      </View>

      <View
        style={[
          styles.listContainer,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        {TOOLKIT_TESTS.map((test, index) => (
          <TestRowItem
            key={test.id}
            test={test}
            colors={colors}
            isLast={index === TOOLKIT_TESTS.length - 1}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  listContainer: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
});

export default React.memo(TestsScreen);
