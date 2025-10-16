import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskItem } from '../../types';

interface Props {
  tasks: TaskItem[];
}

const CompletedList: React.FC<Props> = ({ tasks }) => {
  if (tasks.length === 0) {
    return <Text style={styles.empty}>No completed tasks yet</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      {tasks.map(t => (
        <View key={t.id} style={styles.completedCard}>
          <Text style={styles.title}>{t.title} ({t.category})</Text>
        </View>
      ))}
    </View>
  );
};

export default CompletedList;

const styles = StyleSheet.create({
  completedCard: { backgroundColor: '#e8f5e9', padding: 10, marginVertical: 5, borderRadius: 8 },
  title: { color: '#2e7d32', fontSize: 15 },
  empty: { textAlign: 'center', color: '#999', marginTop: 10 },
});
