import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomTextInput from "../components/CustomTextInput";
import PasswordTextInput from "../components/PasswordTextInput";
import CustomHandleButton from "../components/CustomHandleButton";
import SocialLoginButton from "../components/SocialLoginButton";
import CustomLinkText from "../components/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../themes/Color";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);

  const handleLogin = () => {
    Alert.alert(
      "Login Pressed",
      `Username: ${username}, Password: ${password}`
    );
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
            <Text style={styles.loginText}>Welcome Back</Text>
          </View>
          <CustomTextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username, email, phone number"
            prefixIcon="person"
          />
          <PasswordTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberContainer}>
              <Checkbox
                value={isRemember}
                onValueChange={setIsRemember}
                color={isRemember ? "#0098fd" : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.rememberText}>Remember Password</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <CustomHandleButton
            buttonText="Login"
            buttonColor="#179e7a"
            onPress={handleLogin}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.socialLoginContainer}>
            <SocialLoginButton
              onPress={handleFacebookLogin}
              iconName="facebook"
              iconLibrary="FontAwesome"
              buttonColor="#3b5998"
              buttonText="Login with Facebook"
            />
            <SocialLoginButton
              onPress={handleGoogleLogin}
              iconName="google"
              iconLibrary="FontAwesome"
              buttonColor="#db4437"
              buttonText="Login with Google"
            />
            <SocialLoginButton
              onPress={handleAppleLogin}
              iconName="apple"
              iconLibrary="FontAwesome5"
              buttonColor="#000"
              buttonText="Login with Apple"
            />
            <CustomLinkText
              text="Don't have an account?"
              highlightText="Register"
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
    marginBottom: 80,
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
    marginVertical: 20,
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
});
