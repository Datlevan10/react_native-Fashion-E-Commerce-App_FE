import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import ApiService from "../api/ApiService";

export const handleLogout = async (setIsLoggedIn) => {
  console.log("Logging out user...");
  try {
    await ApiService.logout();

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("lastExitTime");

    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("access_token_expiry");

    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    console.log("Logout successful!");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
