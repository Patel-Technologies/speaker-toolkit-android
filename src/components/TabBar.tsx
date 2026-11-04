import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabType, ThemeColors } from '../types';

interface TabBarProps {
  activeTab: TabType;
  colors: ThemeColors;
  onSelectTab: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'tests', label: 'Tests', icon: '🔊' },
  { id: 'history', label: 'History', icon: '⏱️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, colors, onSelectTab }) => {
  return (
    <View
      style={[
        styles.tabBar,
        {
          borderTopColor: colors.line,
          backgroundColor: colors.bg,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={styles.tabItem}
            accessible
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} tab`}
          >
            {isActive ? (
              <View
                style={[
                  styles.pip,
                  {
                    backgroundColor: colors.accent,
                    borderColor: colors.lineStrong,
                  },
                ]}
              >
                <Text style={styles.tabIconActive}>{tab.icon}</Text>
                <Text style={styles.tabLabelActive}>{tab.label}</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}>
                <Text style={[styles.tabIcon, { opacity: 0.6 }]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, { color: colors.muted }]}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1.5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  pip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  tabIconActive: {
    fontSize: 14,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B090B',
  },
  inactiveTab: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});

export default React.memo(TabBar);
