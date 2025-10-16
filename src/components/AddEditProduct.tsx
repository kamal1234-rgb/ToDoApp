import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { category, priority, TaskItem } from '../types';
import { generateRandomFourCharString } from '../utils/constant';

interface Props {
  item?: TaskItem | null; // Optional if adding new
  onSave: (item: TaskItem) => void;
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

  const [errorMassage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setErrorMessage('');
  }, [title, description, priority, category]);

  const handleSave = () => {
    if (title && description && priority && category) {
      const newItem: TaskItem = {
        id: item?.id || generateRandomFourCharString(),
        title,
        description,
        priority: priority as priority.High | priority.Medium | priority.Low | number | string,
        category: category as category.Work | category.Personal | category.Urgent | string,
      };
      onSave(newItem);
    } else {
      setErrorMessage('all fields are mandatory');
    }
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
        numberOfLines={3}
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
        <Button
          title={isEdit ? 'Update Task' : 'Add Task'}
          onPress={handleSave}
        />
        {onCancel && (
          <Button title="Cancel" onPress={onCancel} color="#d9534f" />
        )}
      </View>

      {errorMassage != '' && (
        <Text style={styles.errortext}>{errorMassage}</Text>
      )}
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
    marginBottom: 10,
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
  errortext: {
    color: '#c21616ff',
    textAlign: 'center',
    marginTop: 10,
  },
});
