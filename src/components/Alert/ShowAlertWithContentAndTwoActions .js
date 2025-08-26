import { Alert } from 'react-native';

const showAlertWithContentAndTwoActions = (content) => {
  Alert.alert(
    "",
    content,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ],
    { cancelable: false }
  );
};

export default showAlertWithContentAndTwoActions;
