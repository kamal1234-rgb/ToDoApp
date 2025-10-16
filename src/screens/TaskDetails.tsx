import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCategoryColor, getPriorityTextColor } from '../utils/constant';

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

interface TaskDetailsProps {
  route: TaskDetailsRouteProp;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ route }) => {
  return (
    <SafeAreaProvider>
      <Text style={styles.taskTitle}>
        {route.params.taskItem.title}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.taskOtherInfo}>
          Category :{' '}
          <Text
            style={{
              color: getCategoryColor(
                route.params.taskItem.category.toString(),
              ),
            }}
          >{route.params.taskItem.category}
          </Text>
        </Text>
        <Text style={styles.taskOtherInfo}>
          Priority :{' '}
          <Text
            style={{
              color: getPriorityTextColor(
                route.params.taskItem.priority.toString(),
              ),
            }}
          >
            {route.params.taskItem.priority}
          </Text>
        </Text>
      </View>

      <Text
        style={styles.taskDescription}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        Description : {route.params.taskItem.description}
      </Text>
    </SafeAreaProvider>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    margin: 10,
  },
  taskDescription: {
    fontSize: 16,
    color: '#2a2727',
    paddingHorizontal: 20,
  },
  taskOtherInfo: {
    fontSize: 16,
    color: '#2a2727',
    padding: 20,
  },
});
