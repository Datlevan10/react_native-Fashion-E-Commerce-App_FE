import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const DashboardMetricCard = ({
  title,
  value,
  icon,
  iconType = "Feather",
  color = Colors.primary,
  style,
}) => {
  const renderIcon = () => {
    const iconProps = {
      name: icon,
      size: 24,
      color: color,
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

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.grayBgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: 'center'
  },
  value: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});

export default DashboardMetricCard;