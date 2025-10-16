import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  activeTab: 'running' | 'completed';
  setActiveTab: (tab: 'running' | 'completed') => void;
  runningCount: number;
  completedCount: number;
}

const TaskTabs: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  runningCount,
  completedCount,
}) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'running' && styles.activeTab]}
        onPress={() => setActiveTab('running')}
      >
        <Text
          style={[styles.tabText, activeTab === 'running' && styles.activeText]}
        >
          Running ({runningCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'completed' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('completed')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'completed' && styles.activeText,
          ]}
        >
          Completed ({completedCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskTabs;

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabButton: {
    flex:1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: { backgroundColor: '#007bff' },
  tabText: { fontSize: 16, color: '#333',textAlign:'center' },
  activeText: { color: '#fff', fontWeight: 'bold' },
});
