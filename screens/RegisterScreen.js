import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import CustomTextInput from "../components/CustomTextInput";
import PasswordTextInput from "../components/PasswordTextInput";
import CustomLinkText from "../components/CustomLinkText";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = () => {
    Alert.alert(
      "Register Pressed",
      `Username: ${username}, Fullname: ${fullname}, Email: ${email}, Phone: ${phoneNumber}, Address: ${address}`
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Create an Account</Text>
      </View>
      <CustomTextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        prefixIcon="person"
      />
      <CustomTextInput
        value={fullname}
        onChangeText={setFullname}
        placeholder="Enter your full name"
        prefixIcon="account-circle"
      />
      <CustomTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        prefixIcon="email"
        keyboardType="email-address"
      />
      <CustomTextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        prefixIcon="phone"
        keyboardType="phone-pad"
      />
      <PasswordTextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      <CustomTextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
        prefixIcon="location-on"
      />
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <CustomLinkText
        text="Already have an account?"
        highlightText="Login"
        onPress={() => navigation.navigate("LoginScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
