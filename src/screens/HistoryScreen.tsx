import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TestHistoryEntry, ThemeColors } from '../types';

interface HistoryScreenProps {
  colors: ThemeColors;
  history: TestHistoryEntry[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ colors, history }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Diagnostic History</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          Audit log of executed acoustic & sensor evaluations
        </Text>
      </View>

      {history.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.line },
          ]}
        >
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>No Test Logs Yet</Text>
          <Text style={[styles.emptyDesc, { color: colors.muted }]}>
            Run any test from the Home or Tests tab to view timestamped diagnostic logs.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.listContainer,
            { backgroundColor: colors.surface, borderColor: colors.line },
          ]}
        >
          {history.map((entry, idx) => (
            <View
              key={entry.id}
              style={[
                styles.historyRow,
                {
                  borderBottomColor: colors.line,
                  borderBottomWidth: idx === history.length - 1 ? 0 : 1,
                },
              ]}
            >
              <View style={styles.leftInfo}>
                <Text style={[styles.testTitle, { color: colors.ink }]}>
                  {entry.testTitle}
                </Text>
                <Text style={[styles.timestamp, { color: colors.muted }]}>
                  {entry.timestamp}
                </Text>
                <Text style={[styles.notes, { color: colors.muted }]}>{entry.notes}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: entry.passed ? `${colors.pass}20` : `${colors.fail}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: entry.passed ? colors.pass : colors.fail },
                  ]}
                >
                  {entry.passed ? '✓ PASSED' : '⚠️ CHECK'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
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
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  listContainer: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  leftInfo: {
    flex: 1,
    gap: 2,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Courier',
  },
  notes: {
    fontSize: 11.5,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
});

export default React.memo(HistoryScreen);
