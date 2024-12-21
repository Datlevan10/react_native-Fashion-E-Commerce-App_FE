import { Alert } from 'react-native';

const ShowAlertWithTitleContentAndOneActions = (title, content, onOkPress) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: 'OK',
        onPress: () => {
          if (onOkPress) {
            onOkPress();
          }
        },
      },
    ],
    { cancelable: false }
  );
};

export default ShowAlertWithTitleContentAndOneActions;
