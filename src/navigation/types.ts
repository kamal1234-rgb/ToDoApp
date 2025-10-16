import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskItem } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  TaskList: undefined;
  TaskDetails: { id: string; taskItem: TaskItem };
};

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();
