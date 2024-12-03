import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";
import CustomTextInput from "../../components/CustomTextInput";
import PasswordTextInput from "../../components/PasswordTextInput";
import CustomHandleButton from "../../components/CustomHandleButton";
import CustomLinkText from "../../components/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../../styles/Color";
import { LinearGradient } from "expo-linear-gradient";
import apiService from "../../api/ApiService";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isAccept, setIsAccept] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    acceptPolicy: "",
  });

  useFocusEffect(
    useCallback(() => {
      setUsername("");
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setAddress("");
      setIsAccept(false);
      setErrorMessages({
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        address: "",
        acceptPolicy: "",
      });
    }, [])
  );

  const validateInputs = () => {
    const errors = {};
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    let isValid = true;

    if (!username) {
      errors.username = "* Username is required.";
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      errors.username = "Invalid username.";
      isValid = false;
    }

    if (!fullName) {
      errors.fullName = "* Full name is required.";
      isValid = false;
    }

    if (!email) {
      errors.email = "* Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "* Invalid email.";
      isValid = false;
    }

    if (!phoneNumber) {
      errors.phoneNumber = "* Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = "* Invalid phone number.";
      isValid = false;
    }

    if (!password) {
      errors.password = "* Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "* Password must be at least 8 characters.";
      isValid = false;
    }

    if (!address) {
      errors.address = "* Address is required.";
      isValid = false;
    }

    if (!isAccept) {
      errors.acceptPolicy = "* You need to accept the privacy policy.";
      isValid = false;
    }

    setErrorMessages(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    const customerData = {
      user_name: username,
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      password,
      address,
    };

    try {
      // console.log("Sending request with data:", customerData);
      const response = await apiService.registerCustomer(customerData);

      console.log(response.status);

      if (response.status === 201) {
        Alert.alert("Registration successful!", "You can log in now.");
        navigation.navigate("LoginScreen");
      } else {
        const errorMessages = response.errors
          ? Object.values(response.errors).flat().join("\n")
          : "An error occurred while registering.";

        Alert.alert("Registration failed", errorMessages);
      }
    } catch (error) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join("\n");
        Alert.alert("Registration failed", errorMessages);
      } else {
        Alert.alert(
          "Registration failed",
          error.message || "An unknown error occurred"
        );
      }
      // console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.body}
    >
      <LinearGradient
        colors={["#325eba", "#e0e0e0"]}
        style={styles.gradientBackground}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.25, y: 0.25 }}
      >
        <View style={styles.container}>
          <Text style={styles.registerText}>Create an Account</Text>

          <CustomTextInput
            value={username}
            onChangeText={(value) => {
              setUsername(value);
              setErrorMessages({ ...errorMessages, username: "" });
            }}
            placeholder="Enter your username"
            prefixIcon="person"
          />
          {errorMessages.username ? (
            <Text style={styles.errorText}>{errorMessages.username}</Text>
          ) : null}

          <CustomTextInput
            value={fullName}
            onChangeText={(value) => {
              setFullName(value);
              setErrorMessages({ ...errorMessages, fullName: "" });
            }}
            placeholder="Enter your full name"
            prefixIcon="account-circle"
          />
          {errorMessages.fullName ? (
            <Text style={styles.errorText}>{errorMessages.fullName}</Text>
          ) : null}

          <CustomTextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrorMessages({ ...errorMessages, email: "" });
            }}
            placeholder="Enter your email"
            prefixIcon="email"
            keyboardType="email-address"
          />
          {errorMessages.email ? (
            <Text style={styles.errorText}>{errorMessages.email}</Text>
          ) : null}

          <CustomTextInput
            value={phoneNumber}
            onChangeText={(value) => {
              setPhoneNumber(value);
              setErrorMessages({ ...errorMessages, phoneNumber: "" });
            }}
            placeholder="Enter your phone number"
            prefixIcon="phone"
            keyboardType="phone-pad"
          />
          {errorMessages.phoneNumber ? (
            <Text style={styles.errorText}>{errorMessages.phoneNumber}</Text>
          ) : null}

          <PasswordTextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrorMessages({ ...errorMessages, password: "" });
            }}
            placeholder="Enter your password"
          />
          {errorMessages.password ? (
            <Text style={styles.errorText}>{errorMessages.password}</Text>
          ) : null}

          <CustomTextInput
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              setErrorMessages({ ...errorMessages, address: "" });
            }}
            placeholder="Enter your address"
            prefixIcon="location-on"
          />
          {errorMessages.address ? (
            <Text style={styles.errorText}>{errorMessages.address}</Text>
          ) : null}

          <View style={styles.acceptContainer}>
            <Checkbox
              value={isAccept}
              onValueChange={(value) => {
                setIsAccept(value);
                setErrorMessages({ ...errorMessages, acceptPolicy: "" });
              }}
              color={isAccept ? "#0288d1" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.acceptText}>
              I accept the{" "}
              <Text style={styles.privacyText}>Privacy Policy</Text>{" "}
            </Text>
          </View>
          {errorMessages.acceptPolicy ? (
            <Text style={styles.errorText}>{errorMessages.acceptPolicy}</Text>
          ) : null}

          <CustomHandleButton
            buttonText="Register"
            buttonColor="#0288d1"
            onPress={handleRegister}
          />
          <CustomLinkText
            text="Already have an account?"
            highlightText="Login"
            onPress={() => navigation.navigate("LoginScreen")}
            highlightColor="#179e7a"
          />
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  registerText: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  acceptContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 3,
  },
  acceptText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#555",
  },
  privacyText: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: "500",
  },
});
