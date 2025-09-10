import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import PasswordTextInput from "../../components/TextField/PasswordTextInput";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import SocialLoginButton from "../../components/Button/SocialLoginButton";
import CustomLinkText from "../../components/Other/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../../styles/Color";
import { LinearGradient } from "expo-linear-gradient";
import ShowAlertWithTitleContentAndOneActions from "../../components/Alert/ShowAlertWithTitleContentAndOneActions ";
import apiService from "../../api/ApiService";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useFocusEffect(
    useCallback(() => {
      setIdentifier("");
      setPassword("");
      setIsRemember(false);
      setIdentifierError("");
      setPasswordError("");
    }, [])
  );

  // function handle Login
  const handleLogin = async () => {
    const identifierErr = validateIdentifier(identifier);
    const passwordErr = !password
      ? "* Password is required."
      : password.length < 8
        ? "* Password must be at least 8 characters."
        : "";

    setIdentifierError(identifierErr);
    setPasswordError(passwordErr);

    if (!identifierErr && !passwordErr) {
      const loginData = {
        identifier,
        password,
      };

      try {
        const response = await apiService.authenticateLoginCustomer(loginData);

        if (response.status === 200) {
          const { access_token, refresh_token, id, expires_in } = response.data.data;
          const expiryTime = Date.now() + expires_in * 1000;

          // check Save Token
          // const checkStoredData = async () => {
          //   try {
          //     const accessToken = await SecureStore.getItemAsync("access_token");
          //     const refreshToken = await SecureStore.getItemAsync("refresh_token");
          //     const customerId = await SecureStore.getItemAsync("customer_id");
          
          //     console.log("Access Token:", accessToken);
          //     console.log("Refresh Token:", refreshToken);
          //     console.log("Customer ID:", customerId);
          
          //     if (accessToken && refreshToken && customerId) {
          //       Alert.alert("Success", "Tokens and customer ID are stored correctly.");
          //     } else {
          //       Alert.alert(
          //         "Incomplete",
          //         "Some data might be missing in SecureStore."
          //       );
          //     }
          //   } catch (error) {
          //     console.error("Error fetching data from SecureStore:", error);
          //     Alert.alert("Error", "Failed to fetch data from SecureStore.");
          //   }
          // };

          // Lưu token và customer_id vào SecureStore
          await SecureStore.setItemAsync("access_token", access_token);
          await SecureStore.setItemAsync("refresh_token", refresh_token);
          await SecureStore.setItemAsync("customer_id", id);
          await SecureStore.setItemAsync("access_token_expiry", expiryTime.toString());
          // await checkStoredData();

          ShowAlertWithTitleContentAndOneActions(
            "Đăng nhập thành côngcông",
            "Chào mừng đến với HappyField"
          );
          navigation.replace("HomeScreen");
        } else if (response.status === 401) {
          const errorMessage =
            response.data?.message || "Incorrect username and password";
          Alert.alert("Login failed", errorMessage);
        } else {
          const errorMessages = response.errors
            ? Object.values(response.errors).flat().join("\n")
            : "An error occurred while logging in.";
          Alert.alert("Login failed", errorMessages);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage =
            error.response.data?.message || "Incorrect username and password";
          Alert.alert("Login failed", errorMessage);
        } else {
          Alert.alert(
            "Login failed",
            error.message || "Incorrect username and password"
          );
        }
      }
    }
  };

  const validateIdentifier = (identifier) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    const usernamePattern = /^[a-zA-Z0-9_]+$/;

    if (!identifier) {
      return "* This field is required.";
    }

    if (emailPattern.test(identifier)) {
      return "";
    } else if (phonePattern.test(identifier)) {
      return "";
    } else if (usernamePattern.test(identifier)) {
      return "";
    } else {
      if (identifier.includes("@")) {
        return "Invalid email format. Please enter a valid email address.";
      } else if (/^\d+$/.test(identifier)) {
        return "Invalid phone number format. Please enter a valid phone number.";
      } else {
        return "Invalid username format. Please enter a valid username.";
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password Pressed");
  };

  const handleFacebookLogin = () => {
    Alert.alert("Login with Facebook");
  };

  const handleGoogleLogin = () => {
    Alert.alert("Login with Google");
  };

  const handleAppleLogin = () => {
    Alert.alert("Login with Apple");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.body}
    >
      <LinearGradient
        colors={["#029a67", "#e0e0e0"]}
        style={styles.gradientBackground}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.25, y: 0.25 }}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.loginText}>Đăng nhập</Text>
            <Text style={styles.subtitleText}>Chào mừng trở lại với Happy Field</Text>
          </View>
          <CustomTextInput
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              setIdentifierError("");
            }}
            placeholder="Email hoặc tên người dùng"
            prefixIcon="person"
            textContentType="username"
            autoComplete="username"
          />
          {identifierError ? (
            <Text style={styles.errorText}>{identifierError}</Text>
          ) : null}
          <PasswordTextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            placeholder="Mật khẩu"
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberContainer}>
              <Checkbox
                value={isRemember}
                onValueChange={setIsRemember}
                color={isRemember ? "#0098fd" : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          <CustomHandleButton
            buttonText="Đăng nhập"
            buttonColor="#179e7a"
            onPress={handleLogin}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.socialLoginContainer}>
            <SocialLoginButton
              onPress={handleFacebookLogin}
              iconName="facebook"
              iconLibrary="FontAwesome"
              buttonColor="#3b5998"
              buttonText="Đăng nhập bằng Facebook"
            />
            <SocialLoginButton
              onPress={handleGoogleLogin}
              iconName="google"
              iconLibrary="FontAwesome"
              buttonColor="#db4437"
              buttonText="Đăng nhập bằng Google"
            />
            <SocialLoginButton
              onPress={handleAppleLogin}
              iconName="apple"
              iconLibrary="FontAwesome5"
              buttonColor="#000"
              buttonText="Đăng nhập bằng Apple"
            />
            <CustomLinkText
              text="Bạn chưa có tài khoản?"
              highlightText="Đăng ký"
              onPress={() => navigation.navigate("RegisterScreen")}
            />
          </View>
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
  loginText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 60,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 3,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  forgotButton: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotText: {
    color: "#0098fd",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    fontSize: 20,
    marginVertical: 10,
    color: "#555",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#555",
  },
  socialLoginContainer: {
    marginTop: 10,
    gap: 10,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
