import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { TodoItem } from '../types';

interface Props {
  item: TodoItem;
  onSave: (updatedItem: TodoItem) => void;
  onCancel: () => void;
}

const AddEditProduct: React.FC<Props> = ({ item, onSave, onCancel }) => {
  const [title, setTitle] = useState<string>(item.title);
  const [description, setDescription] = useState<string>(item.description);
  const [priority, setPriority] = useState<string>(item.priority);
  const [category, setCategory] = useState<string>(item.category);

  const handleSave = () => {
    onSave({
      ...item,
      title,
      description,
      priority: priority as 'High' | 'Medium' | 'Low',
      category: category as 'Work' | 'Personal' | 'Urgent',
    });
  };

  return (
    <View style={styles.container}>
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
        <Button title="💾 Save" onPress={handleSave} />
        <Button title="❌ Cancel" onPress={onCancel} color="#d9534f" />
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
