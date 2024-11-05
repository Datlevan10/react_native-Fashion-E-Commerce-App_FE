import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const OtherInformationForm = ({ items, onRowPress }) => {
  const [switchStates, setSwitchStates] = useState(
    items.reduce(
      (acc, item, index) => ({
        ...acc,
        [index]: item.initialSwitchState || false,
      }),
      {}
    )
  );

  const handleSwitchToggle = (index) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => onRowPress(item.title)}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={item.iconColor || "#000"}
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            {item.showSwitch ? (
              <Switch
              trackColor={{false: '#767577', true: '#029a67'}}
                value={switchStates[index]}
                onValueChange={() => handleSwitchToggle(index)}
              />
            ) : (
              <Feather
                name="chevron-right"
                size={22}
                color="#333"
                style={styles.iconRight}
              />
            )}
          </TouchableOpacity>

          {index < items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
  iconRight: {
    marginLeft: "auto",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
});

export default OtherInformationForm;
