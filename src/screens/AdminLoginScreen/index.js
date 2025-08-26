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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import CustomTextInput from "../../components/TextField/CustomTextInput";
import PasswordTextInput from "../../components/TextField/PasswordTextInput";
import CustomHandleButton from "../../components/Button/CustomHandleButton";
import CustomLinkText from "../../components/Other/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../../styles/Color";
import ShowAlertWithTitleContentAndOneActions from "../../components/Alert/ShowAlertWithTitleContentAndOneActions ";
import apiService from "../../api/ApiService";

export default function AdminLoginScreen({ navigation }) {
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
        const response = await apiService.adminLogin(loginData);

        if (response.status === 200) {
          const { access_token, refresh_token, admin_id, expires_in } = response.data.data;
          const expiryTime = Date.now() + expires_in * 1000;

          // Store admin tokens and data
          await SecureStore.setItemAsync("admin_access_token", access_token);
          await SecureStore.setItemAsync("admin_refresh_token", refresh_token);
          await SecureStore.setItemAsync("admin_id", admin_id.toString());
          await SecureStore.setItemAsync("admin_token_expiry", expiryTime.toString());
          await SecureStore.setItemAsync("user_type", "admin");

          ShowAlertWithTitleContentAndOneActions(
            "Login Successful",
            "Welcome to Admin Dashboard",
            () => {
              navigation.replace("AdminDashboardScreen");
            }
          );
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please check your admin credentials.";
        
        Alert.alert("Login Failed", errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1a73e8", "#e3f2fd"]}
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
              <MaterialIcons name="shield-account" size={72} color={Colors.whiteColor} />
            </View>
            <Text style={styles.title}>Administrator</Text>
            <Text style={styles.subtitle}>System Management Portal</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.securityNotice}>
              <Feather name="lock" size={16} color={Colors.warning} />
              <Text style={styles.securityText}>Secure Admin Access</Text>
            </View>

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
                  color={isRemember ? "#1a73e8" : undefined}
                  style={styles.checkbox}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen", { userType: "admin" })}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <CustomHandleButton
              title={isLoading ? "Authenticating..." : "Admin Login"}
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Security Notice</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.securityWarning}>
              <MaterialIcons name="info-outline" size={20} color={Colors.warning} />
              <Text style={styles.warningText}>
                This is a restricted area. All login attempts are monitored and logged. 
                Unauthorized access attempts will be reported.
              </Text>
            </View>

            <View style={styles.otherOptions}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("StaffLoginScreen")}
              >
                <Feather name="users" size={20} color={Colors.secondary} />
                <Text style={styles.optionText}>Staff Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Feather name="shopping-bag" size={20} color={Colors.primary} />
                <Text style={styles.optionText}>Customer Login</Text>
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: 36,
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
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 8,
  },
  securityText: {
    marginLeft: 8,
    color: Colors.warning,
    fontSize: 14,
    fontWeight: "600",
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
    color: "#1a73e8",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: 20,
    backgroundColor: "#1a73e8",
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
  securityWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${Colors.warning}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
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