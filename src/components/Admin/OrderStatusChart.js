import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const OrderStatusChart = ({ data = [] }) => {
  // Default data for demonstration
  const defaultData = [
    { status: "Chưa giải quyết", count: 25, color: Colors.warning },
    { status: "Đã xác nhận", count: 45, color: Colors.blueProduct },
    { status: "Đã vận chuyển", count: 60, color: Colors.primary },
    { status: "Đã giao hàng", count: 120, color: Colors.success },
    { status: "Đã hủy", count: 8, color: Colors.error },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  const renderStatusItem = (item, index) => {
    const percentage = ((item.count / total) * 100).toFixed(1);
    
    return (
      <View key={index} style={styles.statusItem}>
        <View style={styles.statusInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <Text style={styles.statusLabel}>{item.status}</Text>
        </View>
        <View style={styles.statusStats}>
          <Text style={styles.statusCount}>{item.count}</Text>
          <Text style={styles.statusPercentage}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phân phối trạng thái đơn hàng</Text>
        <FontAwesome5 name="chart-pie" size={16} color={Colors.primary} />
      </View>

      <View style={styles.chartContent}>
        {/* Simple pie chart representation */}
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChart}>
            {chartData.map((item, index) => {
              const percentage = (item.count / total) * 100;
              return (
                <View
                  key={index}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: item.color,
                      height: Math.max(percentage * 2, 8), // Minimum height for visibility
                    },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng số đơn hàng</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
        </View>

        {/* Status list */}
        <View style={styles.statusList}>
          {chartData.map((item, index) => renderStatusItem(item, index))}
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
    marginBottom: 16,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  pieChartContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    flexDirection: "column",
    marginBottom: 10,
  },
  pieSlice: {
    width: "100%",
  },
  totalContainer: {
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  statusList: {
    flex: 1,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    borderBottomOpacity: 0.2,
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  statusStats: {
    alignItems: "flex-end",
  },
  statusCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  statusPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default OrderStatusChart;