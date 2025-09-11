import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../styles/Color';

const QuickTestButton = ({ navigation }) => {
  const navigateToTest = () => {
    navigation.navigate('ZaloPayTestScreen');
  };

  // Only show in development mode
  if (__DEV__) {
    return (
      <TouchableOpacity style={styles.testButton} onPress={navigateToTest}>
        <Text style={styles.testButtonText}>🧪 Test ZaloPay</Text>
      </TouchableOpacity>
    );
  }
  
  return null;
};

const styles = StyleSheet.create({
  testButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1000,
  },
  testButtonText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default QuickTestButton;