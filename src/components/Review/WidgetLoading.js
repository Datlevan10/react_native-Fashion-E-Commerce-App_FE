import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const WidgetLoading = () => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg height="40" width="40" viewBox="0 0 50 50">
          <Circle
            cx="25"
            cy="25"
            r="20"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          <Circle
            cx="25"
            cy="25"
            r="20"
            stroke="#333"
            strokeWidth="4"
            fill="none"
            strokeDasharray="125"
            strokeDashoffset="300"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});

export default WidgetLoading;
