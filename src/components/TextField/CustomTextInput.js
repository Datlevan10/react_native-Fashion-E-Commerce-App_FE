import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../styles/Color';

const CustomTextInput = ({ value, onChangeText, placeholder, prefixIcon, textContentType, autoComplete }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {prefixIcon && (
        <MaterialIcons name={prefixIcon} size={20} color="gray" style={styles.icon} />
      )}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        textContentType={textContentType}
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isFocused && value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <MaterialIcons name="clear" size={20} color="#db4437" style={styles.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomTextInput;
