import { Button, StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';

const AddProduct = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={'title'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder={'description'}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder={'priority'}
        value={priority}
        onChangeText={setPriority}
      />
      <TextInput
        style={styles.input}
        placeholder={'category'}
        value={category}
        onChangeText={setCategory}
      />
      <Button 
      // onPress={} 
      title='add'/>
    </View>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
