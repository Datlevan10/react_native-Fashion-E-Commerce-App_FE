import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const TrackingForm = ({ iconComponent, title, content }) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>{iconComponent}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    </View>
  );
};
const TrackingInfo = ({ addressFrom, addressTo, weight }) => {
  return (
    <View style={styles.container}>
      <TrackingForm
        iconComponent={
          <FontAwesome5 name="map-marker-alt" size={25} color="#036f48" />
        }
        title="From"
        content={addressFrom}
      />
      <TrackingForm
        iconComponent={
          <MaterialIcons name="local-shipping" size={25} color="#036f48" />
        }
        title="Send to"
        content={addressTo}
      />
      <TrackingForm
        iconComponent={<Feather name="box" size={25} color="#036f48" />}
        title="Weight"
        content={weight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    // alignItems: "center",
    paddingVertical: 10,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
    color: "#555",
  },
  content: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default TrackingInfo;
