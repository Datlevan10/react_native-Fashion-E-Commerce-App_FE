import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../../styles/Color";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import ConfettiCannon from "react-native-confetti-cannon";

const ReportReviewSubmittedSuccessModal = ({
  visible,
  onClose,
  imageReport,
  title,
  content,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const confettiRef = useRef(null);

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      onModalShow={() => confettiRef.current?.start()}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.imageReportContainer}>
            <Image source={imageReport} style={styles.imageReport} />
          </View>
          <View style={styles.reportBox}>
            <View style={styles.reportContainer}>
              <Text style={styles.reportTitle}>{title}</Text>
              <Text style={styles.reportContent}>{content}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setIsLoading(true);
              onClose();
            }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfettiCannon
        count={300}
        origin={{ x: 200, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  imageReportContainer: {
    width: 90,
    height: 90,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageReport: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  reportBox: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  reportContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  reportContent: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReportReviewSubmittedSuccessModal;
