import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreScreen from "./ExploreScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import HomeContentScreen from "../components/HomeContentScreen";
import CustomTabLabel from "../components/CustomTabLabel ";
import CustomTabNavigator from "../components/CustomTabNavigator";

const Tab = createBottomTabNavigator();
// import logoFashion from "../assets/wattpad.png"
import logoFashion from "../assets/silhouette.png";

export default function HomeScreen() {
  return (
    <CustomTabNavigator>
      <Tab.Screen
        name="Home"
        component={HomeContentScreen}
        options={{
          tabBarLabel: ({ focused }) => <CustomTabLabel label="Home" />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: ({ focused }) => <CustomTabLabel label="Explore" />,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: ({ focused }) => <CustomTabLabel label="Notification" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <CustomTabLabel label="Profile" />,
        }}
      />
    </CustomTabNavigator>
  );
}

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
