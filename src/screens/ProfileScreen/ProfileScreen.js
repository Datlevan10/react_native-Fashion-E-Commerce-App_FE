import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import apiService from "../../api/ApiService";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../styles/Color";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { handleLogout } from "../../utils/AuthUtils";
import ProfileInfoForm from "../../components/ProfileInfoForm";
import ProfileStats from "../../components/ProfileStats";
import OtherInformationForm from "../../components/OtherInformationForm";
import ShowAlertWithTitleContentAndTwoActions from "../../components/ShowAlertWithTitleContentAndTwoActions ";

import imageDefault from "../../../assets/image/men.jpg";

export default function ProfileScreen({ navigation }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const customer_id = await SecureStore.getItemAsync("customer_id");
        // console.log("Customer ID:", customer_id);
        if (customer_id) {
          const response = await apiService.getInfoCustomerByCustomerId(
            customer_id
          );
          setCustomer(response.data.data);
        } else {
          console.warn("No customer ID found in SecureStore.");
        }
      } catch (error) {
        console.error("Error fetching customer info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  const itemOtherInformation = [
    { icon: "settings", title: "Settings", iconColor: "#999" },
    { icon: "shopping-bag", title: "My Order", iconColor: "#4CAF50" },
    // { icon: "notifications", title: "Notification", iconColor: "#FF9800" },
    {
      icon: "notifications",
      title: "Notifications",
      iconColor: "#FF9800",
      showSwitch: true,
      initialSwitchState: true,
    },
    { icon: "translate", title: "Language", iconColor: "#2196F3" },
    { icon: "payment", title: "Payment & Payout", iconColor: "#fbcc23" },
  ];
  const itemOther = [{ icon: "logout", title: "Logout", iconColor: "#db4437" }];

  const handleRowPress = (title) => {
    console.log("Navigating to:", title);
  };

  const performLogout = async (navigation) => {
    ShowAlertWithTitleContentAndTwoActions(
      "Notification",
      "Logout of your account?",
      async () => {
        try {
          await handleLogout();
          navigation.navigate("LoginScreen");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },
      () => {
        console.log("Logout cancelled");
      }
    );
  };

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
              imageCustomer={customer?.image || imageDefault}
              customerName={customer?.full_name || "Unknown"}
              address={customer?.address || "No address available"}
              onManageProfilePress={() =>
                navigation.navigate("ManagerProfileScreen")
              }
              onDetailPress={() =>
                navigation.navigate("DetailProfileScreen", {
                  image: customer?.image || imageDefault,
                  username: customer?.user_name,
                  fullName: customer?.full_name,
                  email: customer?.email,
                  phoneNumber: customer?.phone_number,
                  address: customer?.address,
                })
              }
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
            <OtherInformationForm
              items={itemOtherInformation}
              onRowPress={handleRowPress}
            />
          </View>
          <View>
            <Text style={styles.otherInformationTitle}></Text>
            <OtherInformationForm
              items={itemOther}
              onRowPress={() => performLogout(navigation)}
            />
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
    marginTop: 10,
  },
  otherInformationTitle: {
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 5,
    color: "#333",
  },
});
