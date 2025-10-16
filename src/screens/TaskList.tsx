import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { todoList } from '../data';
import { TaskItem } from '../types';
import { useAppNavigation } from '../navigation/types';
import AddEditProduct from '../components/AddEditProduct';
import { CommonActions, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ExitAppHandler from '../hooks/ExitAppHandler';

type TaskListRouteProp = RouteProp<RootStackParamList, 'TaskList'>;

interface TaskListProps {
  route: TaskListRouteProp;
}

const groupByCategory = (data: TaskItem[]): Record<string, TaskItem[]> => {
  return data.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, TaskItem[]>);
};

const priorityRank: any = { High: 3, Medium: 2, Low: 1 };

const STORAGE_KEY_RUNNING = '@running_tasks';
const STORAGE_KEY_COMPLETED = '@completed_tasks';

const TaskList: React.FC<TaskListProps> = ({ route }) => {
  const navigation = useAppNavigation();
  const [todos, setTodos] = useState<TaskItem[]>(todoList);
  const [todosBackup, setTodosBackup] = useState<TaskItem[]>(todoList);

  const [searchText, setSearchText] = useState<string>('');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'highToLow' | 'lowToHigh'>(
    'highToLow',
  );

  const [runningTasks, setRunningTasks] = useState<TaskItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([]);

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<TaskItem | null>(null);

  const groupedData = useMemo(() => groupByCategory(todos), [todos]);
  const categories = Object.keys(groupedData);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRunning = await AsyncStorage.getItem(STORAGE_KEY_RUNNING);
        const storedCompleted = await AsyncStorage.getItem(
          STORAGE_KEY_COMPLETED,
        );
        console.log('loadData :: storedCompleted :: ', storedCompleted);
        setRunningTasks(storedRunning ? JSON.parse(storedRunning) : todoList);
        setCompletedTasks(storedCompleted ? JSON.parse(storedCompleted) : []);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadData();
    console.log('loadData');
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY_RUNNING, JSON.stringify(runningTasks));
    AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedTasks));
  }, [completedTasks]);

  const resetCurrentScreen = () => {
    // 🎯 Use CommonActions.reset to overwrite the entire stack state
    navigation.dispatch(
      CommonActions.reset({
        // 1. Set the index to 0 (the first item in the routes array)
        index: 0,

        // 2. Define the new routes array (the new stack history)
        routes: [
          {
            // The name of the current route/screen
            name: route.name,
            // Pass any initial parameters if needed
            params: route.params,
          },
        ],
      }),
    );
  };

  useEffect(() => {
    searchTaskByNameAndDesc(searchText);
    if (!searchText.trim()) {
      console.log('runningTasks');
      // todosBackup,
      setTodos(todosBackup);
    } else {
      console.log('searchText');
    }
  }, [searchText]);

  //   useEffect(() => {
  //   if (!searchText.trim()) {
  //     // If search is empty, reset todos to all running tasks
  //     setTodos(runningTasks);
  //     console.log('runningTasks');
  //   } else {
  //     const lower = searchText.toLowerCase();
  //     const filtered = runningTasks.filter(
  //       t =>
  //         t.title.toLowerCase().includes(lower) ||
  //         t.description.toLowerCase().includes(lower)
  //     );
  //     setTodos(filtered);
  //     console.log('searchText');
  //   }
  //   console.log('searchText, runningTasks');
  // }, [searchText, runningTasks]);

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
    const task = todos.find(t => t.id === id);
    if (task) {
      setEditItem(task);
      // setIsEdit(true)
      setIsEdited(true);
    }
  };

  const onDeleteClick = (id: string) => {
    Alert.alert('Confirm Delete', 'Do you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setTodos(prev => prev.filter(t => t.id !== id));
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveEdit = (updatedItem: TaskItem) => {
    const updatedTodos = [...todos];
    const index = updatedTodos.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      updatedTodos[index] = updatedItem;
    } else {
      updatedTodos.push(updatedItem);
    }
    setTodos(updatedTodos);
    setIsEdited(false);
  };

  const onCompleteClick = (id: string) => {
     console.log("id :: ",id,'\nrunningTasks :: ',runningTasks);
    const task = runningTasks.find(item => item.id === id);
     console.log("task :: ",task);
    if (task) {
      setRunningTasks(prev => prev.filter(t => t.id !== id));
      setCompletedTasks(prev => [...prev, task]);
    }
  };

  const filterTodos = (
    updatedTodos: TaskItem[],
    searchText: string,
  ): TaskItem[] => {
    if (!searchText || searchText.trim() === '') {
      return updatedTodos;
    }
    const lowerSearchText = searchText.toLowerCase().trim();
    return updatedTodos.filter(item => {
      const titleMatches = item.title.toLowerCase().includes(lowerSearchText);
      const descriptionMatches = item.description
        .toLowerCase()
        .includes(lowerSearchText);
      return titleMatches || descriptionMatches;
    });
  };

  function searchTaskByNameAndDesc(searchText: string) {
    console.log('searchText :: ', searchText);
    setTodos(filterTodos(todos, searchText));

    // if (index !== -1) {
    //   updatedTodos[index] = updatedItem;
    // } else {
    //   updatedTodos.push(updatedItem);
    // }
    // setTodos(updatedTodos);
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {isEdited ? (
        <AddEditProduct
          item={editItem}
          onSave={handleSaveEdit}
          onCancel={() => setIsEdited(false)}
          isEdit={editItem ? true : false}
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Search by Task or Description"
            value={searchText}
            onChangeText={data => {
              //debounced not needed 
              setSearchText(prevValue => {
                if (data.length < prevValue.length) {
                  return '';
                } else {
                  return data;
                }
              });
            }}
          />

          <FlatList
            data={categories}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
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
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <View style={styles.taskCard}>
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() =>
                          navigation.navigate('TaskDetails', {
                            id: item.id,
                            taskItem: item,
                          })
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

                      <View style={styles.buttonview}>
                        <Text
                          style={styles.button}
                          onPress={() => {
                            onEditClick(item.id);
                          }}
                        >
                          Edit
                        </Text>
                        <Text
                          style={[styles.button, { color: 'red' }]}
                          onPress={() => onDeleteClick(item.id)}
                        >
                          Delete
                        </Text>
                        <Text
                          style={[styles.button, { color: 'green' }]}
                          onPress={() => onCompleteClick(item.id)}
                        >
                          Complete
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}
            ListFooterComponent={
              <>
                <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
                  Completed Tasks
                </Text>
                {completedTasks.length === 0 ? (
                  <Text style={styles.emptyText}>No completed tasks</Text>
                ) : (
                  completedTasks.map(task => (
                    <View key={task.id} style={styles.completedCard}>
                      <Text style={styles.completedTitle}>
                        {task.title} ({task.category})
                      </Text>
                    </View>
                  ))
                )}
              </>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
                  Keyboard.dismiss();
              setEditItem(null);
              setIsEdited(true);
            }}
          >
            <Text style={styles.addButtonText}>Add New Task</Text>
          </TouchableOpacity>
        </>
      )}

      <ExitAppHandler />
    </SafeAreaProvider>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonview: {
    // flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  button: {
    marginHorizontal: 6,
    borderRadius: 5,
    borderWidth: 0.5,
    textAlign: 'center',
    marginVertical: 2,
    paddingHorizontal: 6,
    color: '#007bff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    margin: 10,
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
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 16,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 10,
  },
  completedCard: {
    backgroundColor: '#e6f7e6',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
  },
  completedTitle: {
    fontSize: 15,
    color: '#006400',
  },
});
