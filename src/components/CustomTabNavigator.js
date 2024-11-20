import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconWithBadge from "./IconWithBadge";
import Colors from "../styles/Color";
import apiService  from "../api/ApiService";

const Tab = createBottomTabNavigator();

const CustomTabNavigator = ({ children, colorBackGround = Colors.whiteColor }) => {
  const [logoSource, setLogoSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoreLogo = async () => {
      try {
        const response = await apiService .getStores();
        if (response && response.data && response.data[0]) {
          setLogoSource({
            uri: `http://192.168.1.10:8080${response.data[0].logo_url}`,
          });
        }
      } catch (error) {
        console.error("Error loading store logo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoreLogo();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Feather name="home" size={size} color={color} />;
          } else if (route.name === "Explore") {
            return <Feather name="search" size={size} color={color} />;
          } else if (route.name === "Notification") {
            return (
              <Ionicons name="notifications-outline" size={size} color={color} />
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
            <ActivityIndicator size="small" color={Colors.blackColor} style={styles.loading} />
          ),
        headerRight: () =>
          route.name === "Home" ? (
            <View style={styles.headerRight}>
              <IconWithBadge
                name="shopping-bag"
                badgeCount={3}
                size={25}
                color={Colors.blackColor}
                style={styles.headerRightIcon}
              />
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
