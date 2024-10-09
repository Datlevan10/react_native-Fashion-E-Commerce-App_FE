import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconWithBadge from "./IconWithBadge";
import logoFashion from "../assets/image/silhouette.png";
import Colors from "../themes/Color";

const Tab = createBottomTabNavigator();

const CustomTabNavigator = ({ children, colorBackGround = Colors.whiteColor }) => {
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
        headerStyle: {
            backgroundColor: colorBackGround,
          },
        headerTitle: route.name === "Home" ? "" : route.name,
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <Image source={logoFashion} style={styles.image} />
          </View>
        ),
        headerRight: () => (
          <View style={styles.headerRightView}>
            <IconWithBadge
              name="shopping-bag"
              badgeCount={3}
              size={25}
              color={Colors.blackColor}
              style={styles.headerRightIcon}
            />
          </View>
        ),
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
  headerRightView: {
    flexDirection: "row",
    marginRight: 15,
  },
  headerRightIcon: {
    marginHorizontal: 0,
  },
  image: {
    height: 40,
    width: 40,
  },
  textLogo: {
    fontFamily: "serif",
    color: "#e91e63",
    fontSize: 30,
  },
});

export default CustomTabNavigator;
