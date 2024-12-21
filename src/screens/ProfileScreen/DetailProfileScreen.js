import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Colors from "../../styles/Color";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import CustomHandleButton from "../../components/Button/CustomHandleButton";

export default function DetailProfileScreen({ route, navigation }) {
  const { image, username, fullName, email, phoneNumber, address } =
    route.params;

  const handleCopy = (text) => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.detailsContainer}>
          {/* <Text style={styles.avatarTitle}>Profile image</Text> */}
          <View style={styles.avatarContainer}>
            <Image source={image} style={styles.avatar} />
          </View>
          <DetailItem
            icon="person-outline"
            title="Username"
            value={username}
            onCopy={() => handleCopy(username)}
          />
          <DetailItem
            icon="account-circle"
            title="Full name"
            value={fullName}
            onCopy={() => handleCopy(fullName)}
          />
          <DetailItem
            icon="email"
            title="Email"
            value={email}
            onCopy={() => handleCopy(email)}
          />
          <DetailItem
            icon="phone"
            title="Phone number"
            value={phoneNumber}
            onCopy={() => handleCopy(phoneNumber)}
          />
          <DetailItem
            icon="location-on"
            title="Address"
            value={address}
            onCopy={() => handleCopy(address)}
          />
          <View style={styles.buttonDone}>
          <CustomHandleButton
            buttonText="Done"
            buttonColor="#179e7a"
            onPress={() => navigation.goBack()}
          />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const DetailItem = ({ icon, title, value, onCopy }) => (
  <View style={styles.detailItem}>
    <Text style={styles.titleText}>{title}</Text>
    <View style={styles.iconValueContainer}>
      <MaterialIcons name={icon} size={24} color="#036f48" />
      <Text style={styles.detailText}>{value}</Text>
      <TouchableOpacity onPress={onCopy} style={styles.copyIcon}>
        <Ionicons name="copy" size={18} color="#036f48" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 25,
    color: Colors.blackColor,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  avatarTitle: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
  },
  avatarContainer: {
    position: "relative",
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  detailsContainer: {
    paddingHorizontal: 18,
  },
  detailItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titleText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
    marginBottom: 15,
  },
  iconValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: 18,
    color: Colors.blackColor,
    flex: 1,
    marginLeft: 10,
  },
  copyIcon: {
    marginLeft: 10,
  },
  buttonDone: {
    marginTop: 50
  }
});
