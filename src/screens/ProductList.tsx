import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { todoList } from '../data';
import { TodoItem } from '../types';
import { useAppNavigation } from '../navigation/types';
import ExitAppHandler from '../hooks/ExitAppHandler';
import AddEditProduct from '../components/AddEditProduct';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type ProductListRouteProp = RouteProp<RootStackParamList, 'ProductList'>;

interface ProductListProps {
  route: ProductListRouteProp;
}

const groupByCategory = (data: TodoItem[]): Record<string, TodoItem[]> => {
  return data.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, TodoItem[]>);
};

const priorityRank: any = { High: 3, Medium: 2, Low: 1 };

const ProductList: React.FC<ProductListProps> = ({ route }) => {
  const navigation = useAppNavigation();
  const [todos, setTodos] = useState<TodoItem[]>(todoList);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'highToLow' | 'lowToHigh'>(
    'highToLow',
  );

  const [isEdit, setIsEdit] = useState<boolean>(true);
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

  const handleSaveEdit = (updatedItem: TodoItem) => {
    let isNew = false;
    // setTodos(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));

    const updatedTodos = [...todos]; // Create a mutable copy for manipulation

    // 1. Check if the item already exists in the list
    const index = updatedTodos.findIndex(item => item.id === updatedItem.id);

    if (index !== -1) {
      // Item found: Update it
      updatedTodos[index] = updatedItem;
      // isNew remains false
    } else {
      // Item not found: Add it and set isNew
      updatedTodos.push(updatedItem);
      isNew = true; // 🎯 Set isNew to true here
    }
    setTodos(updatedTodos);

    setIsEdited(false);
  };

  // 👇 Handle new task coming from AddProductScreen
  useEffect(() => {
    if (route?.params?.newItem) {
      setTodos(prev => [...prev, route.params.newItem]);
      navigation.setParams({ newItem: null }); // clear param
    }
  }, [route?.params?.newItem]);

    const onCompleteClick = (id: string) => {
   
  };

  return (
    <View style={{ flex: 1 }}>
      {isEdited ? (
        // && editItem
        <AddEditProduct
          item={editItem}
          onSave={handleSaveEdit}
          onCancel={() => setIsEdited(false)}
          isEdit={editItem ? true : false}
        />
      ) : (
        <>
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
                      <Pressable
                        style={{ flex: 1 }}
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

                      <View style={styles.buttonview}>
                        <Text
                          style={styles.button}
                          onPress={() => {
                            // setIsEdit(true)
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
                        <Text style={[styles.button, { color: 'green' }]}
                        onPress={() => onCompleteClick(item.id)}
                        >
                          ✅ Complete
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditItem(null);
              setIsEdited(true);
            }}
          >
            <Text style={styles.addButtonText}>Add New Task</Text>
          </TouchableOpacity>
        </>
      )}

      <ExitAppHandler />
    </View>
  );
};

export default ProductList;

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
