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
import CustomTextInput from "../../components/TextField/CustomTextInput";
import PasswordTextInput from "../../components/TextField/PasswordTextInput";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import CustomLinkText from "../../components/Other/CustomLinkText";
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
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "* Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
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
      const response = await apiService.registerCustomer(customerData);

      if (response.status === 201) {
        Alert.alert("Registration successful!", "You can log in now.");
        navigation.navigate("LoginScreen");
      } else if (response.status === 422 && response.data?.error) {
        const errors = response.data.error;
        const errorMessages = [];

        if (errors.email) {
          errorMessages.push(`Email: ${errors.email.join(", ")}`);
        }
        if (errors.user_name) {
          errorMessages.push(`Username: ${errors.user_name.join(", ")}`);
        }
        if (errors.phone_number) {
          errorMessages.push(`Phone number: ${errors.phone_number.join(", ")}`);
        }

        if (errorMessages.length > 0) {
          Alert.alert("Registration failed", errorMessages.join("\n"));
        } else {
          Alert.alert(
            "Registration failed",
            "An error occurred while registering."
          );
        }
      } else {
        Alert.alert(
          "Registration failed",
          "An unknown error occurred while registering."
        );
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response.data?.error) {
        const errors = error.response.data.error;
        const errorMessages = [];

        if (errors.email) {
          errorMessages.push(`Email: ${errors.email.join(", ")}`);
        }
        if (errors.user_name) {
          errorMessages.push(`Username: ${errors.user_name.join(", ")}`);
        }
        if (errors.phone_number) {
          errorMessages.push(`Phone number: ${errors.phone_number.join(", ")}`);
        }

        if (errorMessages.length > 0) {
          Alert.alert("Registration failed", errorMessages.join("\n"));
        } else {
          Alert.alert(
            "Registration failed",
            "An error occurred while registering."
          );
        }
      } else {
        Alert.alert(
          "Registration failed",
          error.message || "An unknown error occurred"
        );
      }
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
          <Text style={styles.registerText}>Tạo tài khoản</Text>

          <CustomTextInput
            value={username}
            onChangeText={(value) => {
              setUsername(value);
              setErrorMessages({ ...errorMessages, username: "" });
            }}
            placeholder="Nhập tên người dùng của bạn"
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
            placeholder="Nhập tên đầy đủ của bạn"
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
            placeholder="Nhập email của bạn"
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
            placeholder="Nhập số điện thoại của bạn"
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
            placeholder="Nhập mật khẩu của bạn"
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
            Tôi chấp nhận{" "}
              <Text style={styles.privacyText}>Chính sách bảo mật</Text>{" "}
            </Text>
          </View>
          {errorMessages.acceptPolicy ? (
            <Text style={styles.errorText}>{errorMessages.acceptPolicy}</Text>
          ) : null}

          <CustomHandleButton
            buttonText="Đăng ký"
            buttonColor="#0288d1"
            onPress={handleRegister}
          />
          <CustomLinkText
            text="Bạn đã có tài khoản?"
            highlightText="Đăng nhập"
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
