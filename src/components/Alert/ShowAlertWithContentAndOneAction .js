import { Alert } from 'react-native';

const showAlertWithContentAndOneAction = (content) => {
  Alert.alert(
    "",
    content,
    [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ],
    { cancelable: false }
  );
};

export default showAlertWithContentAndOneAction;
