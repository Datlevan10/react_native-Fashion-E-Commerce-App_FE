import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

const CustomDrawer = ({
  isOpen,
  onClose,
  children,
  drawerContent,
  drawerPosition = 'left',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  animationDuration = 300,
}) => {
  const translateX = useRef(new Animated.Value(drawerPosition === 'left' ? -DRAWER_WIDTH : DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [isOpen]);

  const openDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: drawerPosition === 'left' ? -DRAWER_WIDTH : DRAWER_WIDTH,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      
      let shouldClose = false;
      
      if (drawerPosition === 'left') {
        shouldClose = translationX < -DRAWER_WIDTH / 3 || velocityX < -500;
      } else {
        shouldClose = translationX > DRAWER_WIDTH / 3 || velocityX > 500;
      }

      if (shouldClose) {
        onClose();
      } else {
        openDrawer();
      }
    }
  };

  const handleOverlayPress = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {children}
      </View>

      {/* Overlay */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
                backgroundColor: overlayColor,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={drawerPosition === 'left' ? [-10, 10] : [-10, 10]}
      >
        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              [drawerPosition]: 0,
              transform: [{ translateX }],
            },
          ]}
        >
          {drawerContent}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomDrawer;