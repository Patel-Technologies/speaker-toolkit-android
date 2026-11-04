import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SoundTest, ThemeColors } from '../types';
import TestRowItem from '../components/TestRowItem';
import SegmentedButton from '../components/SegmentedButton';
import { TOOLKIT_TESTS } from '../data/tests';

interface TestsScreenProps {
  colors: ThemeColors;
  onSelectTest: (test: SoundTest) => void;
}

type CategoryFilter = 'all' | 'hardware' | 'cleaning' | 'diagnostics';

const TestsScreen: React.FC<TestsScreenProps> = ({ colors, onSelectTest }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredTests = useMemo(() => {
    if (activeFilter === 'all') return TOOLKIT_TESTS;
    return TOOLKIT_TESTS.filter((t) => t.category === activeFilter);
  }, [activeFilter]);

  const filterOptions = [
    { key: 'all' as CategoryFilter, label: 'All', count: TOOLKIT_TESTS.length },
    { key: 'hardware' as CategoryFilter, label: 'Drivers' },
    { key: 'cleaning' as CategoryFilter, label: 'Water' },
    { key: 'diagnostics' as CategoryFilter, label: 'Sensors' },
  ];

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

      {/* M3 Segmented Button Quick Filter */}
      <SegmentedButton
        options={filterOptions}
        selectedKey={activeFilter}
        colors={colors}
        onSelect={setActiveFilter}
      />

      <View
        style={[
          styles.listContainer,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        {filteredTests.map((test, index) => (
          <TestRowItem
            key={test.id}
            test={test}
            colors={colors}
            isLast={index === filteredTests.length - 1}
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
    gap: 14,
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
