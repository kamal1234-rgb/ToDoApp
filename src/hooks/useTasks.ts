import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEY_RUNNING, STORAGE_KEY_COMPLETED } from '../utils/constant';
import { TaskItem } from '../types';
import { todoList } from '../data';

export const useTasks = () => {
  const [runningTasks, setRunningTasks] = useState<TaskItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRunning = await AsyncStorage.getItem(STORAGE_KEY_RUNNING);
        const storedCompleted = await AsyncStorage.getItem(STORAGE_KEY_COMPLETED);

        if (storedRunning || storedCompleted) {
          setRunningTasks(storedRunning ? JSON.parse(storedRunning) : []);
          setCompletedTasks(storedCompleted ? JSON.parse(storedCompleted) : []);
        } else {
          // First app load
          setRunningTasks(todoList);
          setCompletedTasks([]);
          await AsyncStorage.setItem(STORAGE_KEY_RUNNING, JSON.stringify(todoList));
          await AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify([]));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY_RUNNING, JSON.stringify(runningTasks));
      AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedTasks));
    }
  }, [runningTasks, completedTasks, loading]);

  return { runningTasks, setRunningTasks, completedTasks, setCompletedTasks, loading };
};
