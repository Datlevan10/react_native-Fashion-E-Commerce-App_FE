import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign } from "react-native-vector-icons";
import Colors from "../../styles/Color";

const NotificationCard = ({
  message,
  relatedData,
  timeAgo,
  notificationId,
  onPress,
  onDelete,
}) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <TouchableOpacity onPress={() => onDelete(notificationId)}>
        <AntDesign name="delete" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => setIsSwiping(true)}
      onSwipeableClose={() => setIsSwiping(false)}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View
          style={[
            styles.card,
            isSwiping && styles.cardWithoutMargin,
            isSwiping && styles.cardWithoutRightBorder,
          ]}
        >
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: relatedData.images[0] }}
                style={styles.image}
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.message}>
              {message} <Text style={styles.timeAgo}>• {timeAgo}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.grayBgColor,
    // borderRadius: 10,
    // elevation: 3,
    // marginVertical: 5,
    // marginHorizontal: 18,
  },
  cardWithoutMargin: {
    marginHorizontal: 0,
  },
  cardWithoutRightBorder: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
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
    fontSize: 15,
    color: "gray",
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#029a67",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deleteContainer: {
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.redColor,
    width: 70,
    // borderTopRightRadius: 10,
    // borderBottomRightRadius: 10,
  },
});

export default NotificationCard;
