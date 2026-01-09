import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import apiService from "../../api/ApiService";
import API_BASE_URL from "../../configs/config";
import Colors from "../../styles/Color";

export default function WelcomeScreen({ navigation }) {
  const [logoSource, setLogoSource] = useState([]);

  useEffect(() => {
    const loadStoreLogo = async () => {
      try {
        const response = await apiService.getStores();
        // console.log("DATA", response.data.data);
        if (response && response.data.data && response.data.data[0]) {
          const logoUrl = `${API_BASE_URL}${response.data.data[0].logo_url}`;
          // console.log("Logo URL:", logoUrl);
          setLogoSource({
            uri: logoUrl,
          });
        }
      } catch (error) {
        console.error("Error loading store logo:", error);
        // Keep default logo if API fails
      }
    };

    loadStoreLogo();

    const timer = setTimeout(() => {
      navigation.replace("UserTypeSelectionScreen");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whiteBgColor,
  },
  logo: {
    width: 350,
    height: 350,
  },
});
