import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const ProfileInfoForm = ({
  imageCustomer,
  customerName,
  address,
  onManageProfilePress,
  onDetailPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <Image source={imageCustomer} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
          <Text style={styles.name}>{customerName}</Text>
          <MaterialIcons name="verified" size={18} color="#2196F3" />
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#036f48" />
            <Text style={styles.address}>{address}</Text>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.stats}>
          250 <Text style={styles.statsText}>Theo dõi</Text>
        </Text>
        <Text style={styles.stats}>
          250 <Text style={styles.statsText}>Follower</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onManageProfilePress}>
          <Text style={styles.buttonText}>Quản lý hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.detailButton]} onPress={onDetailPress}>
          <Text style={[styles.buttonText, styles.detailButtonText]}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    padding: 8,
    gap: 15,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center"
  },
  nameContainer: {
    flexDirection: "row",
    gap: 5
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
  },
  address: {
    fontSize: 16,
    color: "#555",
  },
  stats: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
  },
  statsText: {
    fontSize: 20,
    color: "#333",
    flex: 1,
    textAlign: "justify",
    fontWeight: "normal",
  },
  button: {
    flex: 1,
    backgroundColor: "#029a67",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  detailButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#029a67",
  },
  detailButtonText: {
    color: "#029a67",
  },
});

export default ProfileInfoForm;
