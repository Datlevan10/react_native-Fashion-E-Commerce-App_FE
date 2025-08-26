import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import ApiService from "../api/ApiService";

// Storage keys for different user types
const AUTH_KEYS = {
  customer: {
    accessToken: "access_token",
    refreshToken: "refresh_token",
    userId: "customer_id",
    tokenExpiry: "access_token_expiry",
  },
  staff: {
    accessToken: "staff_access_token",
    refreshToken: "staff_refresh_token",
    userId: "staff_id",
    tokenExpiry: "staff_token_expiry",
  },
  admin: {
    accessToken: "admin_access_token",
    refreshToken: "admin_refresh_token",
    userId: "admin_id",
    tokenExpiry: "admin_token_expiry",
  },
};

// Get current user type
export const getCurrentUserType = async () => {
  try {
    return await SecureStore.getItemAsync("user_type");
  } catch (error) {
    console.error("Error getting user type:", error);
    return null;
  }
};

// Set current user type
export const setCurrentUserType = async (userType) => {
  try {
    await SecureStore.setItemAsync("user_type", userType);
  } catch (error) {
    console.error("Error setting user type:", error);
  }
};

// Get auth tokens for specific user type
export const getAuthTokens = async (userType) => {
  try {
    const keys = AUTH_KEYS[userType];
    if (!keys) return null;

    const accessToken = await SecureStore.getItemAsync(keys.accessToken);
    const refreshToken = await SecureStore.getItemAsync(keys.refreshToken);
    const userId = await SecureStore.getItemAsync(keys.userId);
    const tokenExpiry = await SecureStore.getItemAsync(keys.tokenExpiry);

    return {
      accessToken,
      refreshToken,
      userId,
      tokenExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
    };
  } catch (error) {
    console.error("Error getting auth tokens:", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return Date.now() > expiryTime;
};

// Refresh token based on user type
export const refreshAuthToken = async (userType) => {
  try {
    const tokens = await getAuthTokens(userType);
    if (!tokens || !tokens.refreshToken) return false;

    let response;
    switch (userType) {
      case "staff":
        response = await ApiService.staffRefreshToken(tokens.refreshToken);
        break;
      case "admin":
        response = await ApiService.adminRefreshToken(tokens.refreshToken);
        break;
      case "customer":
        // Implement customer refresh token if available
        return false;
      default:
        return false;
    }

    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data.data;
      const expiryTime = Date.now() + expires_in * 1000;
      
      const keys = AUTH_KEYS[userType];
      await SecureStore.setItemAsync(keys.accessToken, access_token);
      await SecureStore.setItemAsync(keys.refreshToken, refresh_token);
      await SecureStore.setItemAsync(keys.tokenExpiry, expiryTime.toString());
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

// Universal logout function
export const handleUniversalLogout = async (userType, navigation) => {
  console.log(`Logging out ${userType} user...`);
  
  try {
    // Call appropriate logout API based on user type
    switch (userType) {
      case "customer":
        await ApiService.logout();
        break;
      case "staff":
        await ApiService.staffLogout();
        break;
      case "admin":
        await ApiService.adminLogout();
        break;
    }

    // Clear tokens for specific user type
    const keys = AUTH_KEYS[userType];
    if (keys) {
      await SecureStore.deleteItemAsync(keys.accessToken);
      await SecureStore.deleteItemAsync(keys.refreshToken);
      await SecureStore.deleteItemAsync(keys.userId);
      await SecureStore.deleteItemAsync(keys.tokenExpiry);
    }

    // Clear user type
    await SecureStore.deleteItemAsync("user_type");

    // Clear common storage
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("lastExitTime");

    console.log("Logout successful!");
    
    // Navigate to user type selection screen
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: "UserTypeSelectionScreen" }],
      });
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Check authentication status and redirect
export const checkAuthStatus = async (navigation) => {
  try {
    const userType = await getCurrentUserType();
    if (!userType) return false;

    const tokens = await getAuthTokens(userType);
    if (!tokens || !tokens.accessToken) return false;

    // Check if token is expired
    if (isTokenExpired(tokens.tokenExpiry)) {
      // Try to refresh token
      const refreshed = await refreshAuthToken(userType);
      if (!refreshed) {
        await handleUniversalLogout(userType, navigation);
        return false;
      }
    }

    // Redirect based on user type
    switch (userType) {
      case "customer":
        navigation.replace("HomeScreen");
        break;
      case "staff":
        navigation.replace("StaffManagementScreen");
        break;
      case "admin":
        navigation.replace("AdminDashboardScreen");
        break;
    }

    return true;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
};

// Store login data based on user type
export const storeLoginData = async (userType, loginData) => {
  try {
    const keys = AUTH_KEYS[userType];
    if (!keys) return false;

    const { access_token, refresh_token, expires_in } = loginData;
    const userId = loginData.id || loginData.staff_id || loginData.admin_id;
    const expiryTime = Date.now() + expires_in * 1000;

    await SecureStore.setItemAsync(keys.accessToken, access_token);
    await SecureStore.setItemAsync(keys.refreshToken, refresh_token);
    await SecureStore.setItemAsync(keys.userId, userId.toString());
    await SecureStore.setItemAsync(keys.tokenExpiry, expiryTime.toString());
    await setCurrentUserType(userType);

    return true;
  } catch (error) {
    console.error("Error storing login data:", error);
    return false;
  }
};

// Legacy support for existing customer logout
export const handleLogout = async (setIsLoggedIn) => {
  console.log("Legacy logout for customer...");
  try {
    await handleUniversalLogout("customer", null);
    
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
  } catch (error) {
    console.error("Error in legacy logout:", error);
  }
};