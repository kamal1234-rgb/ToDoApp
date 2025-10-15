import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import ExitAppHandler from '../hooks/ExitAppHandler';
import { todoList } from '../data';
import { TodoItem } from '../types';
import { useAppNavigation } from '../navigation/types';
import AddEditProduct from '../components/AddEditProduct';

const groupByCategory = (data: TodoItem[]): Record<string, TodoItem[]> => {
  return data.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, TodoItem[]>);
};

const priorityRank: any = { High: 3, Medium: 2, Low: 1 };

const ProductList: React.FC = () => {
  const navigation = useAppNavigation();
  const [todos, setTodos] = useState<TodoItem[]>(todoList);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'highToLow' | 'lowToHigh'>('highToLow');

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<TodoItem | null>(null);

  const groupedData = useMemo(() => groupByCategory(todos), [todos]);
  const categories = Object.keys(groupedData);

  const sortedData = useMemo(() => {
    if (!selectedCategory) return groupedData;
    const categoryTasks = [...groupedData[selectedCategory]];

    categoryTasks.sort((a, b) =>
      sortOrder === 'highToLow'
        ? priorityRank[b.priority] - priorityRank[a.priority]
        : priorityRank[a.priority] - priorityRank[b.priority],
    );

    return {
      ...groupedData,
      [selectedCategory]: categoryTasks,
    };
  }, [selectedCategory, sortOrder, todos]);

  const onEditClick = (id: string) => {
    const itemToEdit = todos.find(item => item.id === id);
    if (itemToEdit) {
      setEditItem(itemToEdit);
      setIsEdited(true);
    }
  };

  const onDeleteClick = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTodos(prev => prev.filter(task => task.id !== id));
        },
      },
    ]);
  };

  const handleSaveEdit = (updatedItem: TodoItem) => {
    setTodos(prev =>
      prev.map(item => (item.id === updatedItem.id ? updatedItem : item)),
    );
    setIsEdited(false);
    setEditItem(null);
  };

  return (
    <View style={{ flex: 1 }}>



      {isEdited && editItem && (
        <AddEditProduct
          item={editItem}
          onSave={handleSaveEdit}
          onCancel={() => setIsEdited(false)}
        />
      )}

      {!isEdited && (
        <FlatList
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item: category }) => (
            <View style={styles.categorySection}>
              <View style={styles.headerRow}>
                <Text style={styles.categoryTitle}>{category}</Text>

                <Text
                  style={styles.sortToggle}
                  onPress={() => {
                    setSelectedCategory(category);
                    setSortOrder(prev =>
                      prev === 'lowToHigh' ? 'highToLow' : 'lowToHigh',
                    );
                  }}
                >
                  Sort ↑ ↓
                </Text>
              </View>

              <FlatList
                data={sortedData[category]}
                keyExtractor={task => task.id}
                renderItem={({ item }) => (
                  <View style={styles.taskCard}>
                    <View style={{ flex: 1 }}>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('ProductDetails', { id: item.id })
                        }
                      >
                        <Text style={styles.taskTitle}>
                          {item.title} ({item.priority})
                        </Text>
                        <Text
                          style={styles.taskDescription}
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {item.description}
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.buttonview}>
                      <Text
                        style={styles.button}
                        onPress={() => onEditClick(item.id)}
                      >
                        Edit
                      </Text>
                      <Text
                        style={[styles.button, { color: 'red' }]}
                        onPress={() => onDeleteClick(item.id)}
                      >
                        Delete
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        />
      )}

      <ExitAppHandler />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonview: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  button: {
    marginHorizontal: 6,
    color: '#007bff',
    fontWeight: '600',
  },
  categorySection: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sortToggle: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '700',
  },
  taskCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    flexDirection: 'row',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  taskDescription: {
    fontSize: 14,
    color: '#2a2727',
    width: '70%',
  },
});
