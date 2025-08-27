import React, { useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens for core e-commerce functionality
import WelcomeScreen from "./screens/WelcomeScreen";
import UserTypeSelectionScreen from "./screens/UserTypeSelectionScreen";
import LoginScreen from "./screens/LoginScreen";
import StaffLoginScreen from "./screens/StaffLoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import CategoryProductsScreen from "./screens/CategoryProductsScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ManagerProfileScreen from "./screens/ProfileScreen/ManagerProfileScreen";
import DetailProfileScreen from "./screens/ProfileScreen/DetailProfileScreen";
import SettingsScreen from "./screens/ProfileScreen/SettingsScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen/ForgotPasswordScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import TrackingDetailScreen from "./screens/CheckoutScreen/TrackingDetailScreen";
import WishlistScreen from "./screens/WishlistScreen";

import UserInactivity from "react-native-user-inactivity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import api from "./api/AxiosInstance";
import { handleLogout } from "./utils/AuthUtils";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showWelcome, setShowWelcome] = useState(true);
  const backgroundTime = useRef(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        const expiryTime = await SecureStore.getItemAsync(
          "access_token_expiry"
        );
        // console.log("Checking login status...");
        // console.log("Access Token:", token);
        // console.log("Expiry Time:", expiryTime);

        if (token && expiryTime && Date.now() < parseInt(expiryTime, 10)) {
          setIsLoggedIn(true);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          await SecureStore.deleteItemAsync("access_token");
          await SecureStore.deleteItemAsync("refresh_token");
          await SecureStore.deleteItemAsync("access_token_expiry");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkLoginStatus();

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    setAppState(AppState.currentState);

    const welcomeTimer = setTimeout(() => setShowWelcome(false), 5000);

    return () => {
      appStateListener.remove();
      clearTimeout(welcomeTimer);
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    console.log("AppState changed from", appState, "to", nextAppState);

    if (appState.match(/inactive|background/) && nextAppState === "active") {
      const lastExitTime = await AsyncStorage.getItem("lastExitTime");
      console.log("Last exit time retrieved:", lastExitTime);

      const timeInBackground =
        Date.now() - (lastExitTime ? parseInt(lastExitTime) : Date.now());

      console.log(
        `App was in background for ${timeInBackground / 1000} seconds`
      );

      if (timeInBackground > 60000) {
        console.log("Session expired, logging out...");
        await handleLogout(setIsLoggedIn);
        alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      }
    } else if (nextAppState.match(/inactive|background/)) {
      const currentTime = Date.now();
      console.log(
        "Saving currentTime to AsyncStorage before background:",
        currentTime
      );

      await AsyncStorage.setItem("lastExitTime", currentTime.toString())
        .then(() => {
          console.log("Saved lastExitTime successfully.");
        })
        .catch((error) => {
          console.error("Error saving lastExitTime:", error);
        });
    }

    setAppState(nextAppState);
  };

  if (isChecking) {
    return null;
  }

  return (
    <NavigationContainer>
      <UserInactivity
        timeForInactivity={1 * 60 * 1000}
        onAction={async (isActive) => {
            if (isActive) {
              const token = await SecureStore.getItemAsync("access_token");
              const expiryTime = await SecureStore.getItemAsync(
                "access_token_expiry"
              );

              if (!token || Date.now() >= parseInt(expiryTime, 10)) {
                try {
                  const refreshToken = await SecureStore.getItemAsync(
                    "refresh_token"
                  );
                  if (refreshToken) {
                    const { data } = await api.post(
                      "/customers/auth/refresh-token",
                      {
                        refresh_token: refreshToken,
                      }
                    );
                    const { access_token, expires_in } = data;
                    const newExpiryTime = Date.now() + expires_in * 1000;

                    await SecureStore.setItemAsync(
                      "access_token",
                      access_token
                    );
                    await SecureStore.setItemAsync(
                      "access_token_expiry",
                      newExpiryTime.toString()
                    );
                  } else {
                    setIsLoggedIn(false);
                  }
                } catch (error) {
                  console.error("Error refreshing token:", error);
                  setIsLoggedIn(false);
                }
              }
            }
          }}
        >
          <Stack.Navigator
            initialRouteName={
              showWelcome ? "WelcomeScreen" : 
              isLoggedIn ? "HomeScreen" : 
              "UserTypeSelectionScreen"
            }
          >
            {/* Welcome & Auth Screens */}
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserTypeSelectionScreen"
              component={UserTypeSelectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StaffLoginScreen"
              component={StaffLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            
            {/* Main App Screens */}
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExploreScreen"
              component={ExploreScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CategoryProductsScreen"
              component={CategoryProductsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckoutScreen"
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TrackingDetailScreen"
              component={TrackingDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WishlistScreen"
              component={WishlistScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManagerProfileScreen"
              component={ManagerProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailProfileScreen"
              component={DetailProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </UserInactivity>
    </NavigationContainer>
  );
}
