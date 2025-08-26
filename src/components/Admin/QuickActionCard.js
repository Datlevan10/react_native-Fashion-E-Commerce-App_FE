import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const QuickActionCard = ({
  title,
  icon,
  iconType = "Feather",
  color = Colors.primary,
  onPress,
  style,
}) => {
  const renderIcon = () => {
    const iconProps = {
      name: icon,
      size: 28,
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
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {renderIcon()}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
  },
});

export default QuickActionCard;