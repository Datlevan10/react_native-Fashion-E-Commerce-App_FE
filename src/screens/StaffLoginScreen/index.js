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
  SafeAreaView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import PasswordTextInput from "../../components/TextField/PasswordTextInput";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import CustomLinkText from "../../components/Other/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../../styles/Color";
import ShowAlertWithTitleContentAndOneActions from "../../components/Alert/ShowAlertWithTitleContentAndOneActions ";
import apiService from "../../api/ApiService";

export default function StaffLoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIdentifier("");
      setPassword("");
      setIsRemember(false);
      setIdentifierError("");
      setPasswordError("");
    }, [])
  );

  const validateIdentifier = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,}$/;
    
    if (!identifier) {
      return "* Email, username, or phone is required.";
    }
    
    const isEmail = emailRegex.test(identifier);
    const isPhone = phoneRegex.test(identifier);
    const isUsername = identifier.length >= 3;
    
    if (!isEmail && !isPhone && !isUsername) {
      return "* Please enter a valid email, username, or phone number.";
    }
    
    return "";
  };

  const handleLogin = async () => {
    const identifierErr = validateIdentifier(identifier);
    const passwordErr = !password
      ? "* Password is required."
      : password.length < 6
        ? "* Password must be at least 6 characters."
        : "";

    setIdentifierError(identifierErr);
    setPasswordError(passwordErr);

    if (!identifierErr && !passwordErr) {
      setIsLoading(true);
      const loginData = {
        identifier,
        password,
      };

      try {
        const response = await apiService.staffLogin(loginData);

        if (response.status === 200) {
          const { access_token, refresh_token, staff_id, expires_in } = response.data.data;
          const expiryTime = Date.now() + expires_in * 1000;

          // Store staff tokens and data
          await SecureStore.setItemAsync("staff_access_token", access_token);
          await SecureStore.setItemAsync("staff_refresh_token", refresh_token);
          await SecureStore.setItemAsync("staff_id", staff_id.toString());
          await SecureStore.setItemAsync("staff_token_expiry", expiryTime.toString());
          await SecureStore.setItemAsync("user_type", "staff");

          ShowAlertWithTitleContentAndOneActions(
            "Login Successful",
            "Welcome to Staff Management System",
            () => {
              navigation.replace("StaffManagementScreen");
            }
          );
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please check your credentials.";
        
        Alert.alert("Login Failed", errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <LinearGradient
      colors={[Colors.secondary, "#e8f5e9"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="user-tie" size={64} color={Colors.whiteColor} />
            </View>
            <Text style={styles.title}>Đăng nhập nhân viên</Text>
            <Text style={styles.subtitle}>Truy cập tài khoản nhân viên của bạn</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomTextInput
              placeholder="Email, Username, or Phone"
              value={identifier}
              onChangeText={setIdentifier}
              error={identifierError}
              style={styles.input}
              autoCapitalize="none"
            />

            <PasswordTextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              style={styles.input}
            />

            <View style={styles.optionsContainer}>
              <View style={styles.rememberContainer}>
                <Checkbox
                  value={isRemember}
                  onValueChange={setIsRemember}
                  color={isRemember ? Colors.secondary : undefined}
                  style={styles.checkbox}
                />
                <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen", { userType: "staff" })}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <CustomHandleButton
              buttonText={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Bạn không có tài khoản nhân viên?</Text>
              <CustomLinkText
                text="Liên hệ Quản trị viên"
                onPress={() => Alert.alert("Liên hệ với quản trị viên", "Vui lòng liên hệ với quản trị viên của bạn để tạo tài khoản nhân viên.")}
                style={styles.linkButton}
              />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Các tùy chọn đăng nhập khác</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.otherOptions}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Feather name="shopping-bag" size={20} color={Colors.primary} />
                <Text style={styles.optionText}>Customer Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("AdminLoginScreen")}
              >
                <Feather name="shield" size={20} color="#1a73e8" />
                <Text style={styles.optionText}>Admin Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.whiteColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  rememberText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  forgotText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkButton: {
    marginLeft: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderColor,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  otherOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginHorizontal: 5,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
});