import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconWithBadge from "../Navbar/IconWithBadge";
import Colors from "../../styles/Color";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";

const Tab = createBottomTabNavigator();

const CustomTabNavigator = ({
  children,
  colorBackGround = Colors.whiteColor,
}) => {
  const navigation = useNavigation();
  const [logoSource, setLogoSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItemCount = async () => {
    try {
      const storedCustomerId = await SecureStore.getItemAsync("customer_id");
      if (!storedCustomerId) {
        setCartItemCount(0);
        return;
      }

      const response = await apiService.getProductInCartDetailByCustomerId(
        storedCustomerId
      );

      if (response.status === 200 && response.data?.data) {
        const cartItems = response.data.data;
        setCartItemCount(Array.isArray(cartItems) ? cartItems.length : 0);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.log("Error fetching cart count:", error);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const loadStoreLogo = async () => {
      try {
        const response = await apiService.getStores();
        if (response && response.data.data && response.data.data[1]) {
          setLogoSource({
            uri: `${API_BASE_URL}${response.data.data[1].logo_url}`,
          });
        }
      } catch (error) {
        console.error("Error loading store logo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoreLogo();
    fetchCartItemCount();
    
    // Set up interval to refresh cart count periodically
    const interval = setInterval(fetchCartItemCount, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Listen for navigation events to refresh cart count
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartItemCount();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Feather name="home" size={size} color={color} />;
          } else if (route.name === "Explore") {
            return <Feather name="search" size={size} color={color} />;
          } else if (route.name === "Wishlist") {
            return <Feather name="heart" size={size} color={color} />;
          } else if (route.name === "Notification") {
            return (
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Profile") {
            return <Ionicons name="person-outline" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: Colors.blackColor,
        tabBarInactiveTintColor: Colors.darkGray,
        headerShown: route.name === "Home",
        headerStyle: {
          backgroundColor: colorBackGround,
        },
        headerTitle: route.name === "Home" ? "" : route.name,
        headerLeft: () =>
          route.name === "Home" && !loading ? (
            <View style={styles.headerLeft}>
              <Image source={logoSource} style={styles.image} />
            </View>
          ) : (
            <ActivityIndicator
              size="small"
              color={Colors.blackColor}
              style={styles.loading}
            />
          ),
        headerRight: () =>
          route.name === "Home" ? (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CartScreen")}
              >
                <IconWithBadge
                  name="shopping-bag"
                  badgeCount={cartItemCount}
                  size={25}
                  color={Colors.blackColor}
                  style={styles.headerRightIcon}
                />
              </TouchableOpacity>
            </View>
          ) : null,
      })}
    >
      {children}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18,
  },
  headerRight: {
    flexDirection: "row",
    marginRight: 15,
  },
  headerRightIcon: {
    marginHorizontal: 0,
  },
  image: {
    height: 35,
    width: 55,
    marginBottom: 10,
  },
  loading: {
    marginLeft: 18,
  },
});

export default CustomTabNavigator;
