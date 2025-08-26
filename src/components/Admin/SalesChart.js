import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../styles/Color";

const { width } = Dimensions.get("window");

// Simple chart component since we don't have complex charting libraries
const SalesChart = ({ data = [] }) => {
  const [chartData, setChartData] = useState([
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 1900 },
    { day: "Wed", sales: 800 },
    { day: "Thu", sales: 1600 },
    { day: "Fri", sales: 2100 },
    { day: "Sat", sales: 2800 },
    { day: "Sun", sales: 2400 },
  ]);

  const maxValue = Math.max(...chartData.map(item => item.sales));
  const chartWidth = width - 80;
  const barWidth = chartWidth / chartData.length - 10;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales This Week</Text>
        <FontAwesome5 name="chart-line" size={16} color={Colors.primary} />
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((item, index) => {
            const barHeight = (item.sales / maxValue) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barColumn}>
                  <Text style={styles.valueText}>${(item.sales / 1000).toFixed(1)}k</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        width: barWidth,
                        backgroundColor: Colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Sales</Text>
          <Text style={styles.summaryValue}>
            ${chartData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryValue}>
            ${Math.round(chartData.reduce((sum, item) => sum + item.sales, 0) / chartData.length).toLocaleString()}
          </Text>
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
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    justifyContent: "space-around",
    width: "100%",
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barColumn: {
    alignItems: "center",
    height: 130,
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 4,
    marginTop: 5,
  },
  valueText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: "500",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingTop: 16,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});

export default SalesChart;