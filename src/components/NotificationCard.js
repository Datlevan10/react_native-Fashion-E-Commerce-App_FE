import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign } from "react-native-vector-icons";
import Colors from "../styles/Color";

const NotificationCard = ({ message, relatedData, timeAgo, onDelete }) => {
  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <AntDesign
        name="delete"
        size={24}
        color={Colors.whiteColor}
        onPress={onDelete}
      />
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.card}>
        <Image source={{ uri: relatedData.images[0] }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>
            {message} <Text style={styles.timeAgo}>• {timeAgo}</Text>
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 10,
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 18,
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: Colors.blackColor,
  },
  timeAgo: {
    fontSize: 14,
    color: Colors.grayTextColor,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  deleteContainer: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.redColor,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default NotificationCard;
