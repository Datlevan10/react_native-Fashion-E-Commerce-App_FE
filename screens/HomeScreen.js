import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreScreen from "./ExploreScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import HomeContentScreen from "../components/HomeContentScreen";
import Feather from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import IconWithBadge from "../components/IconWithBadge";
import CustomTabLabel from "../components/CustomTabLabel ";

const Tab = createBottomTabNavigator();
// import logoFashion from "../assets/wattpad.png"
import logoFashion from "../assets/silhouette.png";

export default function HomeScreen() {
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
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerTitle: route.name === "Home" ? "" : route.name,
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <Image source={logoFashion} style={styles.image} />
            {/* <Text style={styles.textLogo}>Fashion Store</Text> */}
          </View>
          // <Feather
          //   name="menu"
          //   size={24}
          //   color="black"
          //   style={styles.headerLeft}
          // />
        ),
        headerRight: () => (
          <View style={styles.headerRightView}>
            {/* <Feather name="shopping-bag" size={24} color="black" style={styles.headerRight} /> */}
            <IconWithBadge
              name="shopping-bag"
              badgeCount={3}
              size={25}
              color="black"
              style={styles.headerRightIcon}
            />
          </View>
        ),
      })}
    >
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
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18
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
    color: '#e91e63',
    fontSize: 30
  },
});
