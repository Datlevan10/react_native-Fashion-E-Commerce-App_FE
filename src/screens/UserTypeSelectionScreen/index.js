import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../styles/Color";

export default function UserTypeSelectionScreen({ navigation }) {
  const userTypes = [
    {
      id: "customer",
      title: "Khách hàng",
      subtitle: "Mua sản phẩm yêu thích của bạn",
      icon: "shopping-bag",
      iconType: "Feather",
      colors: [Colors.primary, "#ff8a95"],
      route: "LoginScreen",
    },
    {
      id: "staff",
      title: "Nhân viên",
      subtitle: "Quản lý hoạt động cửa hàng",
      icon: "user-tie",
      iconType: "FontAwesome5",
      colors: [Colors.secondary, "#66bb6a"],
      route: "StaffLoginScreen",
    },
    {
      id: "admin",
      title: "Quản trị viên",
      subtitle: "Quản lý toàn bộ hệ thống",
      icon: "shield-account",
      iconType: "MaterialIcons",
      colors: ["#1a73e8", "#4285f4"],
      route: "AdminLoginScreen",
    },
  ];

  const renderIcon = (icon, iconType, color) => {
    const iconProps = {
      name: icon,
      size: 48,
      color: Colors.whiteColor,
    };

    switch (iconType) {
      case "MaterialIcons":
        return <MaterialIcons {...iconProps} />;
      case "FontAwesome5":
        return <FontAwesome5 {...iconProps} />;
      case "Feather":
      default:
        return <Feather {...iconProps} />;
    }
  };

  const handleUserTypeSelect = (route) => {
    navigation.navigate(route);
  };

  return (
    <LinearGradient
      colors={["#e3f2fd", "#ffffff"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chào mừng</Text>
            <Text style={styles.subtitle}>Vui lòng chọn loại tài khoản của bạn để tiếp tục</Text>
          </View>

          <View style={styles.cardsContainer}>
            {userTypes.map((userType) => (
              <TouchableOpacity
                key={userType.id}
                style={styles.cardWrapper}
                onPress={() => handleUserTypeSelect(userType.route)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={userType.colors}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.iconContainer}>
                    {renderIcon(userType.icon, userType.iconType)}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{userType.title}</Text>
                    <Text style={styles.cardSubtitle}>{userType.subtitle}</Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Feather name="chevron-right" size={24} color={Colors.whiteColor} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Happy-Field App</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.whiteColor,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.9,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});