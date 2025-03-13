import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import Colors from "../../styles/Color";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import apiService from "../../api/ApiService";
import ReportReviewSubmittedSuccessModal from "./ReportReviewSubmittedSuccessModal";

const imageReportSuccess = require("../../../assets/image/write_report.png");

const ReportReviewModal = ({
  isVisible,
  onClose,
  storeName,
  reviewId,
  reporterId,
  onReportSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "Review contains private information.",
    "Review contains objectionable language.",
    "Review contains advertising or spam.",
    "Review contains violent and disgusting content.",
    "Other violations.",
  ];

  const [
    isReportReviewSubmittedSuccessModalVisible,
    setReportReviewSubmittedSuccessModalVisible,
  ] = useState(false);

  const handleSubmitReport = async () => {
    if (selectedReason) {
      try {
        const data = {
          review_id: reviewId,
          reporter_id: reporterId,
          report_reason: selectedReason,
        };

        await apiService.reportReview(data);
        // alert("Report submitted successfully.");
        // Handle lai chox nay khi submit report thanh cong se tat modal ReportReviewModal va hien thi modal success
        // onClose();
        setReportReviewSubmittedSuccessModalVisible(true);
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report.");
      }
    } else {
      alert("Please select a reason for reporting.");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Report this review</Text>
        <Text style={styles.subtitle}>
          Thank you for taking the time to help{" "}
          {<Text style={styles.storeName}>{storeName}</Text>}. Your report is
          anonymous.
        </Text>

        <ScrollView>
          {reasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioButtonContainer}
              onPress={() => setSelectedReason(reason)}
            >
              <RadioButton
                value={reason}
                status={selectedReason === reason ? "checked" : "unchecked"}
                onPress={() => setSelectedReason(reason)}
              />
              <Text style={styles.radioText}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.submitButtonText}>Report this review</Text>
        </TouchableOpacity>
        <ReportReviewSubmittedSuccessModal
          visible={isReportReviewSubmittedSuccessModalVisible}
          onClose={() => setReportReviewSubmittedSuccessModalVisible(false)}
          imageReport={imageReportSuccess}
          title="Thank you for taking the time to help H&M."
          content="Your report is anonymous."
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "95%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  storeName: {
    fontWeight: "bold",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
    numberOfLines: 2,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: "400",
  },
});

export default ReportReviewModal;
