import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import ApiService from "../../api/ApiService";

export default function WelcomeScreen({ navigation }) {
  const [logoSource, setLogoSource] = useState([]);

  useEffect(() => {
    const loadStoreLogo = async () => {
      try {
        const response = await ApiService.getStores();
        if (response && response.data && response.data[0]) {
          setLogoSource({
            uri: `http://192.168.1.9:8080${response.data[0].logo_url}`,
          });
        }
      } catch (error) {
        console.error("Error loading store logo:", error);
      }
    };

    loadStoreLogo();

    const timer = setTimeout(() => {
      navigation.replace("LoginScreen");
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
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
