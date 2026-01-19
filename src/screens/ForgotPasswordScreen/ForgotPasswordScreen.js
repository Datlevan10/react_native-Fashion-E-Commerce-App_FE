import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import Colors from "../../styles/Color";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import CustomLinkText from "../../components/Other/CustomLinkText";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleForgotPassword = () => {
    if (email) {
      Alert.alert(
        "Success",
        "A password reset link has been sent to your email"
      );
      setEmail("");
    } else {
      Alert.alert("Error", "Please enter a valid email address");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={22} color={Colors.blackColor} />
      </TouchableOpacity>
      <Text style={styles.title}>Request for supplying password</Text>
      <Text style={styles.subTitle}>Please enter your basic information</Text>
      <CustomTextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
        prefixIcon="email"
      />
      <CustomTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        prefixIcon="email"
      />
      <CustomTextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        prefixIcon="phone"
        keyboardType="decimal-pad"
        maxLength={10}
      />

      <CustomHandleButton
        buttonText="Continue"
        buttonColor="#179e7a"
        onPress={handleForgotPassword}
      />

      <CustomLinkText
        text="Remembered your password?"
        highlightText="Login"
        highlightColor="#179e7a"
        onPress={() => navigation.navigate("LoginScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
