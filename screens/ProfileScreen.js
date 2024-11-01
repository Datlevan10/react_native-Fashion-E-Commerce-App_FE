import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../themes/Color";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import ProfileInfoForm from "../components/ProfileInfoForm";
import ProfileStats from "../components/ProfileStats";
import OtherInformationForm from "../components/OtherInformationForm";
import ShowAlertWithTitleContentAndTwoActions from "../components/ShowAlertWithTitleContentAndTwoActions ";

import imageTest from "../assets/image/men.jpg";

export default function ProfileScreen({ navigation }) {
  const itemOtherInformation = [
    { icon: "settings", title: "Settings", iconColor: "#999" },
    { icon: "shopping-bag", title: "My Order", iconColor: "#4CAF50" },
    // { icon: "notifications", title: "Notification", iconColor: "#FF9800" },
    { icon: "notifications", title: "Notifications", iconColor: "#FF9800", showSwitch: true, initialSwitchState: true },
    { icon: "translate", title: "Language", iconColor: "#2196F3" },
    { icon: "payment", title: "Payment & Payout", iconColor: "#fbcc23" },
  ];
  const itemOther = [
    { icon: "logout", title: "Logout", iconColor: "#db4437" },
  ];

  const handleRowPress = (title) => {
    console.log("Navigating to:", title);
  };

  const handleLogout = () => {
    ShowAlertWithTitleContentAndTwoActions("Notification", "Logout of your account?")
  }

  return (
    <LinearGradient
      colors={["#029a67", "#e0e0e0"]}
      style={styles.gradientBackground}
      start={{ x: 0.6, y: 0 }}
      end={{ x: 0.6, y: 0.6 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={styles.profileInformation}>
            {/* <Text style={styles.profileInformationTitle}>
              Profile Information
            </Text> */}
            <ProfileInfoForm
              imageCustomer={imageTest}
              customerName="John Doe"
              address="123 Main St, City, Country"
              onManageProfilePress={() => navigation.navigate("ManagerProfileScreen")}
              onDetailPress={() => alert("Detail")}
            />
          </View>
          <View style={styles.profileStats}>
            <ProfileStats
              totalOrders={823}
              totalIncome="1,400k"
              totalViews={150}
            />
          </View>
          <View style={styles.otherInformation}>
            <Text style={styles.otherInformationTitle}>Other Information</Text>
            <OtherInformationForm items={itemOtherInformation} onRowPress={handleRowPress} />
          </View>
          <View>
            <Text style={styles.otherInformationTitle}></Text>
            <OtherInformationForm items={itemOther} onRowPress={handleLogout} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "transparent",
  },
  profileInformationTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
  },
  profileStats: {
    marginTop: 10,
  },
  otherInformation: {
    marginTop: 10
  },
  otherInformationTitle: {
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 10,
    color: "#333",
  },
});
