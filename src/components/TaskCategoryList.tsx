import React, { useMemo, useState } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { groupByCategory } from '../utils/helpers';
import { TaskItem } from '../types';
import { useAppNavigation } from '../navigation/types';

interface Props {
  tasks: TaskItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const priorityRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

const TaskCategoryList: React.FC<Props> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const navigation = useAppNavigation();
  const [sortOrders, setSortOrders] = useState<Record<string, 'highToLow' | 'lowToHigh'>>({});

  // 🧠 Group the tasks by category
  const grouped = useMemo(() => groupByCategory(tasks), [tasks]);
  const categories = Object.keys(grouped);

  // ⚙️ Return sorted data per category if sort order exists
  const sortedGrouped = useMemo(() => {
    const updatedGroups: Record<string, TaskItem[]> = {};
    categories.forEach(category => {
      const order = sortOrders[category];
      const tasksInCategory = [...grouped[category]];

      if (order) {
        tasksInCategory.sort((a, b) =>
          order === 'highToLow'
            ? priorityRank[b.priority] - priorityRank[a.priority]
            : priorityRank[a.priority] - priorityRank[b.priority],
        );
      }

      updatedGroups[category] = tasksInCategory;
    });
    return updatedGroups;
  }, [grouped, sortOrders]);

  // 🔁 Toggle sort order for selected category
  const toggleSortOrder = (category: string) => {
    setSortOrders(prev => ({
      ...prev,
      [category]: prev[category] === 'lowToHigh' ? 'highToLow' : 'lowToHigh',
    }));
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={c => c}
      renderItem={({ item: category }) => (
        <View style={styles.categorySection}>
          {/* 🏷 Category Header */}
          <View style={styles.headerRow}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <Text
              style={styles.sortToggle}
              onPress={() => toggleSortOrder(category)}
            >
              Sort {sortOrders[category] === 'highToLow' ? '↓' : '↑'}
            </Text>
          </View>

          {/* 🧩 Render tasks for this category */}
          {sortedGrouped[category].map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate('TaskDetails', {
                    id: task.id,
                    taskItem: task,
                  })
                }
              >
                <Text style={styles.taskTitle}>
                  {task.title} ({task.priority})
                </Text>
                <Text style={styles.taskDesc} numberOfLines={3}>
                  {task.description}
                </Text>
              </Pressable>

              <View>
                <Text style={styles.btn} onPress={() => onEdit(task.id)}>
                  Edit
                </Text>
                <Text
                  style={[styles.btn, { color: 'red' }]}
                  onPress={() => {
                    Alert.alert(
                                      'Confirm Delete',
                                      'Do you want to delete this task?',
                                      [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                          text: 'Delete',
                                          onPress: () => {
                                           onDelete(task.id)
                                          },
                                          style: 'destructive',
                                        },
                                      ],
                                    );
                  }}
                >
                  Delete
                </Text>
                <Text
                  style={[styles.btn, { color: 'green' }]}
                  onPress={() => onComplete(task.id)}
                >
                  Complete
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    />
  );
};

export default TaskCategoryList;

const styles = StyleSheet.create({
  categorySection: { marginBottom: 10 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sortToggle: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginEnd: 16,
  },
  categoryTitle: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  taskTitle: { fontWeight: '600', fontSize: 15 },
  taskDesc: { color: '#444' },
  btn: {
    marginHorizontal: 6,
    borderRadius: 5,
    borderWidth: 0.5,
    textAlign: 'center',
    marginVertical: 2,
    paddingHorizontal: 6,
    color: '#007bff',
    fontWeight: '600',
  },
});
