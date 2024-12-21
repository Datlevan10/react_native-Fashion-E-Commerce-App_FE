import { Alert } from 'react-native';

const ShowAlertWithTitleContentAndTwoActions = (title, content, onOkPress, onCancelPress) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: 'Cancel',
        onPress: onCancelPress || (() => console.log('Cancel Pressed')),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: onOkPress || (() => console.log('OK Pressed')),
      },
    ],
    { cancelable: false }
  );
};

export default ShowAlertWithTitleContentAndTwoActions;
