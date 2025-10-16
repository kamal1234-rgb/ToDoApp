// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   TouchableOpacity,
//   TextInput,
//   Keyboard,
// } from 'react-native';
// import { todoList } from '../data';
// import { TaskItem } from '../types';
// import { useAppNavigation } from '../navigation/types';
// import AddEditProduct from '../components/AddEditProduct';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import ExitAppHandler from '../hooks/ExitAppHandler';
// import { STORAGE_KEY_COMPLETED, STORAGE_KEY_RUNNING } from '../utils/constant';

// type TaskListRouteProp = RouteProp<RootStackParamList, 'TaskList'>;

// interface TaskListProps {
//   route: TaskListRouteProp;
// }

// const groupByCategory = (data: TaskItem[]): Record<string, TaskItem[]> => {
//   return data.reduce((groups, item) => {
//     if (!groups[item.category]) groups[item.category] = [];
//     groups[item.category].push(item);
//     return groups;
//   }, {} as Record<string, TaskItem[]>);
// };

// const priorityRank: any = { High: 3, Medium: 2, Low: 1 };

// type Tab = 'running' | 'completed';

// const TaskList: React.FC<TaskListProps> = ({ route }) => {
//   const navigation = useAppNavigation();
//   const [todos, setTodos] = useState<TaskItem[]>(todoList);
//   const [todosBackup, setTodosBackup] = useState<TaskItem[]>(todoList);

//   const [searchText, setSearchText] = useState<string>('');

//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<'highToLow' | 'lowToHigh'>(
//     'highToLow',
//   );

//   const [runningTasks, setRunningTasks] = useState<TaskItem[]>([]);
//   const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([]);

//   const [isEdited, setIsEdited] = useState<boolean>(false);
//   const [editItem, setEditItem] = useState<TaskItem | null>(null);

//   const groupedData = useMemo(() => groupByCategory(todos), [todos]);
//   const categories = Object.keys(groupedData);

//   const groupedDataByComplited = useMemo(
//     () => groupByCategory(completedTasks),
//     [completedTasks],
//   );
//   const categoriesCompletedTasks = Object.keys(groupedDataByComplited);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedRunning = await AsyncStorage.getItem(STORAGE_KEY_RUNNING);
//         const storedCompleted = await AsyncStorage.getItem(
//           STORAGE_KEY_COMPLETED,
//         );
//         console.log('loadData :: storedCompleted :: ', storedCompleted);
//         setRunningTasks(storedRunning ? JSON.parse(storedRunning) : todos);
//         setCompletedTasks(storedCompleted ? JSON.parse(storedCompleted) : []);
//       } catch (error) {
//         console.error('Error loading tasks:', error);
//       }
//     };
//     loadData();
//     console.log('loadData');
//   }, []);

//   useEffect(() => {
//     console.log('completedTasks ::: ', completedTasks);
//     // setTodos(todosBackup);
//     AsyncStorage.setItem(STORAGE_KEY_RUNNING, JSON.stringify(runningTasks));
//     AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedTasks));
//   }, [completedTasks]);

//   useEffect(() => {
//     searchTaskByNameAndDesc(searchText);
//     if (!searchText.trim()) {
//       // setTodos(todosBackup);
//     }
//   }, [searchText]);

//   const sortedData = useMemo(() => {
//     if (!groupedData || Object.keys(groupedData).length === 0) {
//       setSelectedCategory(null);
//       return {};
//     }
//     if (!selectedCategory) return groupedData;
//     console.log(
//       'groupedData :: ',
//       groupedData,
//       '\nselectedCategory :: ',
//       selectedCategory,
//     );
//     const categoryTasks = [...groupedData[selectedCategory]];
//     categoryTasks.sort((a, b) =>
//       sortOrder === 'highToLow'
//         ? priorityRank[b.priority] - priorityRank[a.priority]
//         : priorityRank[a.priority] - priorityRank[b.priority],
//     );
//     return {
//       ...groupedData,
//       [selectedCategory]: categoryTasks,
//     };
//   }, [selectedCategory, sortOrder, todos]);

//   const onEditClick = (id: string) => {
//     const task = todos.find(t => t.id === id);
//     if (task) {
//       setEditItem(task);
//       // setIsEdit(true)
//       setIsEdited(true);
//     }
//   };

//   const onDeleteClick = (id: string) => {
//     Alert.alert('Confirm Delete', 'Do you want to delete this task?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         onPress: () => {
//           setTodos(prev => prev.filter(t => t.id !== id));
//         },
//         style: 'destructive',
//       },
//     ]);
//   };

//   const handleSaveEdit = (updatedItem: TaskItem) => {
//     const updatedTodos = [...todos];
//     const index = updatedTodos.findIndex(item => item.id === updatedItem.id);
//     if (index !== -1) {
//       updatedTodos[index] = updatedItem;
//     } else {
//       updatedTodos.push(updatedItem);
//     }
//     setTodos(updatedTodos);
//     setIsEdited(false);
//   };

//   const onCompleteClick = (id: string) => {
//     const task = runningTasks.find(item => item.id === id);
//     if (task) {
//       const updatedTask = { ...task, isCompleted: true };
//       AsyncStorage.setItem(
//         STORAGE_KEY_COMPLETED,
//         JSON.stringify([...completedTasks, updatedTask]),
//       );
//       setRunningTasks(prev => prev.filter(t => t.id !== id));
//       setCompletedTasks(prev => [...prev, updatedTask]);
//     }
//   };

//   const filterTodos = (
//     updatedTodos: TaskItem[],
//     searchText: string,
//   ): TaskItem[] => {
//     if (!searchText || searchText.trim() === '') {
//       return updatedTodos;
//     }
//     const lowerSearchText = searchText.toLowerCase().trim();
//     return updatedTodos.filter(item => {
//       const titleMatches = item.title.toLowerCase().includes(lowerSearchText);
//       const descriptionMatches = item.description
//         .toLowerCase()
//         .includes(lowerSearchText);
//       return titleMatches || descriptionMatches;
//     });
//   };

//   function searchTaskByNameAndDesc(searchText: string) {
//     setTodos(filterTodos(todos, searchText));
//   }

//   const [activeTab, setActiveTab] = useState<Tab>('running');

//   return (
//     <SafeAreaProvider style={{ flex: 1 }}>
//       {isEdited ? (
//         <AddEditProduct
//           item={editItem}
//           onSave={handleSaveEdit}
//           onCancel={() => setIsEdited(false)}
//           isEdit={editItem ? true : false}
//         />
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Search by Task or Description"
//             value={searchText}
//             onChangeText={data => {
//               //debounced not needed
//               setSearchText(prevValue => {
//                 if (data.length < prevValue.length) {
//                   return '';
//                 } else {
//                   return data;
//                 }
//               });
//             }}
//           />

//           <FlatList
//             data={activeTab === 'running' ? categories : []}
//             keyExtractor={item => item}
//             keyboardShouldPersistTaps="handled"
//             ListHeaderComponent={
//               <>
//                 <View style={styles.tabBar}>
//                   <TouchableOpacity
//                     style={[
//                       styles.tabButton,
//                       activeTab === 'running' && styles.activeTab,
//                     ]}
//                     onPress={() => setActiveTab('running')}
//                   >
//                     <Text
//                       style={[
//                         styles.tabText,
//                         activeTab === 'running' && styles.activeText,
//                       ]}
//                     >
//                       Running ({runningTasks.length})
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[
//                       styles.tabButton,
//                       activeTab === 'completed' && styles.activeTab,
//                     ]}
//                     onPress={() => setActiveTab('completed')}
//                   >
//                     <Text
//                       style={[
//                         styles.tabText,
//                         activeTab === 'completed' && styles.activeText,
//                       ]}
//                     >
//                       Completed ({completedTasks.length})
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             }
//             renderItem={({ item: category }) => (
//               <View style={styles.categorySection}>
//                 <View style={styles.headerRow}>
//                   <Text style={styles.categoryTitle}>{category}</Text>
//                   <Text
//                     style={styles.sortToggle}
//                     onPress={() => {
//                       setSelectedCategory(category);
//                       setSortOrder(prev =>
//                         prev === 'lowToHigh' ? 'highToLow' : 'lowToHigh',
//                       );
//                     }}
//                   >
//                     Sort ↑ ↓
//                   </Text>
//                 </View>

//                 <FlatList
//                   data={activeTab === 'running' ? sortedData[category] : []}
//                   keyExtractor={task => task.id}
//                   keyboardShouldPersistTaps="handled"
//                   renderItem={({ item }) => (
//                     <View style={styles.taskCard}>
//                       <Pressable
//                         style={{ flex: 1 }}
//                         onPress={() =>
//                           navigation.navigate('TaskDetails', {
//                             id: item.id,
//                             taskItem: item,
//                           })
//                         }
//                       >
//                         <Text style={styles.taskTitle}>
//                           {item.title} ({item.priority})
//                         </Text>
//                         <Text
//                           style={styles.taskDescription}
//                           numberOfLines={3}
//                           ellipsizeMode="tail"
//                         >
//                           {item.description}
//                         </Text>
//                       </Pressable>

//                       <View style={styles.buttonview}>
//                         <Text
//                           style={styles.button}
//                           onPress={() => {
//                             onEditClick(item.id);
//                           }}
//                         >
//                           Edit
//                         </Text>
//                         <Text
//                           style={[styles.button, { color: 'red' }]}
//                           onPress={() => onDeleteClick(item.id)}
//                         >
//                           Delete
//                         </Text>
//                         {/* {!item.isCompleted && ( */}
//                         <Text
//                           style={[styles.button, { color: 'green' }]}
//                           onPress={() => {
//                             onCompleteClick(item.id);
//                           }}
//                         >
//                           Complete
//                         </Text>
//                         {/* )} */}
//                       </View>
//                     </View>
//                   )}
//                 />
//               </View>
//             )}
//             ListFooterComponent={
//               activeTab === 'running' ? (
//                 <></>
//               ) : (
//                 <>
//                   <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
//                     Completed Tasks
//                   </Text>
//                   {completedTasks.length === 0 ? (
//                     <Text style={styles.emptyText}>No completed tasks</Text>
//                   ) : (
//                     completedTasks.map(task => (
//                       <View key={task.id} style={styles.completedCard}>
//                         <Text style={styles.completedTitle}>
//                           {task.title} ({task.category})
//                         </Text>
//                       </View>
//                     ))
//                   )}
//                 </>
//               )
//             }
//           />

//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => {
//               Keyboard.dismiss();
//               setEditItem(null);
//               setIsEdited(true);
//             }}
//           >
//             <Text style={styles.addButtonText}>Add New Task</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       <ExitAppHandler />
//     </SafeAreaProvider>
//   );
// };

// export default TaskList;

// const styles = StyleSheet.create({
//   addButton: {
//     backgroundColor: '#007bff',
//     padding: 14,
//     borderRadius: 30,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   buttonview: {
//     // flexDirection: 'row',
//     alignSelf: 'flex-end',
//   },
//   button: {
//     marginHorizontal: 6,
//     borderRadius: 5,
//     borderWidth: 0.5,
//     textAlign: 'center',
//     marginVertical: 2,
//     paddingHorizontal: 6,
//     color: '#007bff',
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     margin: 10,
//   },
//   categorySection: {
//     marginVertical: 10,
//     paddingHorizontal: 16,
//   },
//   categoryTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   sortToggle: {
//     fontSize: 14,
//     color: '#007bff',
//     fontWeight: '700',
//   },
//   taskCard: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     elevation: 2,
//     flexDirection: 'row',
//   },
//   taskTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#222',
//   },
//   taskDescription: {
//     fontSize: 14,
//     color: '#2a2727',
//     width: '70%',
//   },
//   sectionHeader: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//     marginHorizontal: 16,
//     marginTop: 10,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#999',
//     fontSize: 14,
//     marginVertical: 10,
//   },
//   completedCard: {
//     backgroundColor: '#e6f7e6',
//     marginHorizontal: 16,
//     marginVertical: 6,
//     padding: 10,
//     borderRadius: 8,
//   },
//   completedTitle: {
//     fontSize: 15,
//     color: '#006400',
//   },

//   tabBar: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: 'center',
//     borderBottomWidth: 3,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {
//     borderBottomColor: '#007AFF', // Blue color for active tab
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#888',
//     fontWeight: '600',
//   },
//   activeText: {
//     color: '#007AFF',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: '#fff',
//   },
//   itemTitle: {
//     fontSize: 16,
//     flexShrink: 1,
//   },
//   itemStatus: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 10,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppNavigation } from '../navigation/types';
import ExitAppHandler from '../hooks/ExitAppHandler';
import AddEditProduct from '../components/AddEditProduct';
import { TaskItem } from '../types';
import { useTasks } from '../hooks/useTasks';
import TaskTabs from '../components/TaskTabs';
import TaskCategoryList from '../components/TaskCategoryList';
import CompletedList from '../components/CompletedList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY_COMPLETED, STORAGE_KEY_RUNNING } from '../utils/constant';
import { todoList } from '../data';

const TaskList: React.FC = () => {
  const {
    runningTasks,
    setRunningTasks,
    completedTasks,
    setCompletedTasks,
    loading,
  } = useTasks();

  const [filteredRunning, setFilteredRunning] = useState<TaskItem[]>([]);
  const [filteredCompleted, setFilteredCompleted] = useState<TaskItem[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const filterTasks = (tasks: TaskItem[], text: string) => {
    if (!text.trim()) return tasks;
    const lower = text.toLowerCase();
    return tasks.filter(
      t =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.category.toString().toLowerCase().includes(lower),
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRunning = await AsyncStorage.getItem(STORAGE_KEY_RUNNING);
        const storedCompleted = await AsyncStorage.getItem(
          STORAGE_KEY_COMPLETED,
        );

        const running = storedRunning ? JSON.parse(storedRunning) : todoList;
        const completed = storedCompleted ? JSON.parse(storedCompleted) : [];

        setRunningTasks(running);
        setCompletedTasks(completed);

        setFilteredRunning(running);
        setFilteredCompleted(completed);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setFilteredRunning(filterTasks(runningTasks, searchText));
    setFilteredCompleted(filterTasks(completedTasks, searchText));
  }, [searchText, runningTasks, completedTasks]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY_RUNNING, JSON.stringify(runningTasks));
    AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedTasks));
  }, [runningTasks, completedTasks]);

  const [activeTab, setActiveTab] = useState<'running' | 'completed'>(
    'running',
  );
  const [isEdited, setIsEdited] = useState(false);
  const [editItem, setEditItem] = useState<TaskItem | null>(null);

  const handleComplete = (id: string) => {
    const task = runningTasks.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, isCompleted: true };
    setRunningTasks(prev => prev.filter(t => t.id !== id));
    setCompletedTasks(prev => [...prev, updated]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {isEdited ? (
        <AddEditProduct
          item={editItem}
          isEdit={!!editItem}
          onSave={updated => {
            setRunningTasks(prev => [
              ...prev.filter(t => t.id !== updated.id),
              updated,
            ]);
            setIsEdited(false);
          }}
          onCancel={() => setIsEdited(false)}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="Search by task, description, or category"
            value={searchText}
            onChangeText={setSearchText}
          />

          <TaskTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            runningCount={
              searchText != '' ? filteredRunning.length : runningTasks.length
            }
            completedCount={completedTasks.length}
          />

          {activeTab === 'running' ? (
            <TaskCategoryList
              tasks={searchText != '' ? filteredRunning : runningTasks}
              onEdit={id => {
                const t =
                  searchText != ''
                    ? filteredRunning.find(x => x.id === id)
                    : runningTasks.find(x => x.id === id);
                if (t) {
                  setEditItem(t);
                  setIsEdited(true);
                }
              }}
              onDelete={id =>
                searchText != ''
                  ? setFilteredRunning(prev => prev.filter(t => t.id !== id))
                  : setRunningTasks(prev => prev.filter(t => t.id !== id))
              }
              onComplete={handleComplete}
            />
          ) : (
            <CompletedList tasks={completedTasks} />
          )}

          {activeTab === 'running' && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setEditItem(null);
                setIsEdited(true);
              }}
            >
              <Text style={styles.addText}>Add New Task</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ExitAppHandler />
    </SafeAreaProvider>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  addBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 30,
    alignSelf: 'center',
    margin: 20,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
});
