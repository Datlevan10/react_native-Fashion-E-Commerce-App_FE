import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomLoginAndRegisterButton = ({ buttonText, buttonColor, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: buttonColor || '#179e7a' }]}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomLoginAndRegisterButton;
