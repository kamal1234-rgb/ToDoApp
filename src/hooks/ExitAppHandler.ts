import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Alert, Platform } from 'react-native';

const ExitAppHandler = () => {
  
  useFocusEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false },
      );
      return true;
    };

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  });

  return null;
};

export default ExitAppHandler;
