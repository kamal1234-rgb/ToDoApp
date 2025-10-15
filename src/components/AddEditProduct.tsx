import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { TodoItem } from '../types';
import uuid from 'react-native-uuid';

interface Props {
  item?: TodoItem | null; // Optional if adding new
  onSave: (item: TodoItem) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const AddEditProduct: React.FC<Props> = ({
  item,
  onSave,
  onCancel,
  isEdit,
}) => {
  const [title, setTitle] = useState<string>(item?.title || '');
  const [description, setDescription] = useState<string>(
    item?.description || '',
  );
  const [priority, setPriority] = useState<string>(
    item?.priority.toString() || '',
  );
  const [category, setCategory] = useState<string>(
    item?.category.toString() || '',
  );

  function generateRandomFourCharString() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 4;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const handleSave = () => {
    const newItem: TodoItem = {
      id: item?.id || generateRandomFourCharString(),
      title,
      description,
      priority: priority as 'High' | 'Medium' | 'Low',
      category: category as 'Work' | 'Personal' | 'Urgent',
    };
    onSave(newItem);
  };

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text style={styles.categoryTitle}>
        {item ? 'Update Task' : 'Add New Task'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Priority (High, Medium, Low)"
        value={priority}
        onChangeText={setPriority}
      />
      <TextInput
        style={styles.input}
        placeholder="Category (Work, Personal, Urgent)"
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.btnRow}>
        <Button title={isEdit ? '💾 Update' : '➕ Add'} onPress={handleSave} />
        {onCancel && (
          <Button title="❌ Cancel" onPress={onCancel} color="#d9534f" />
        )}
      </View>
    </View>
  );
};

export default AddEditProduct;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
        marginBottom:10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
