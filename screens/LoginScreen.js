import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import CustomTextInput from "../components/CustomTextInput";
import PasswordTextInput from "../components/PasswordTextInput";
import SocialLoginButton from "../components/SocialLoginButton";
import CustomLinkText from "../components/CustomLinkText";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <View style={styles.container}>
        <View>
            <Text>Welcome Back</Text>
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
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.forgotButton}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
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
          text="Don't have an account"
          highlightText="Register"
          onPress={() => navigation.navigate("RegisterScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  forgotButton: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotText: {
    color: "#0066cc",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#10b982",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    fontSize: 16,
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
  },
});
