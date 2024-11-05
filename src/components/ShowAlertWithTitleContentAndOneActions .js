import { Alert } from 'react-native';

const ShowAlertWithTitleContentAndOneActions = (title, content) => {
  Alert.alert(
    title,
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

export default ShowAlertWithTitleContentAndOneActions;
