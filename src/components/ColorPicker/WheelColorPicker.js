import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Colors from '../../styles/Color';

const { width, height } = Dimensions.get('window');

// Predefined colors for quick selection
const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#808080', // Gray
  '#964B00', // Brown
  '#FFD700', // Gold
  '#C0C0C0', // Silver
  '#000080', // Navy
];

const WheelColorPicker = ({ visible, onClose, onSelectColor, initialColors = '' }) => {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [hexInput, setHexInput] = useState('#FF0000');
  const [selectedColors, setSelectedColors] = useState(() => {
    if (initialColors) {
      return initialColors.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  });

  if (!visible) return null;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setHexInput(color);
  };

  const handleHexInputChange = (text) => {
    // Ensure # prefix
    if (!text.startsWith('#')) {
      text = '#' + text;
    }
    
    setHexInput(text);
    
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) {
      setSelectedColor(text);
    }
  };

  const handleAddColor = () => {
    const colorToAdd = selectedColor.toUpperCase();
    
    if (!selectedColors.includes(colorToAdd)) {
      const newColors = [...selectedColors, colorToAdd];
      setSelectedColors(newColors);
    } else {
      Alert.alert('Thông báo', 'Màu này đã được thêm rồi');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setSelectedColors(selectedColors.filter(c => c !== colorToRemove));
  };

  const handlePresetColorSelect = (color) => {
    setSelectedColor(color);
    setHexInput(color);
  };

  const handleDone = () => {
    if (selectedColors.length > 0) {
      onSelectColor(selectedColors.join(', '));
    } else if (selectedColor) {
      // If no colors were added to list, use the currently selected color
      onSelectColor(selectedColor);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedColors([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Feather name="x" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Chọn Màu Sắc</Text>
          <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
            <Text style={styles.doneText}>Xong</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Color Wheel Picker */}
          <View style={styles.pickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={handleColorChange}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
              swatches={false}
              discrete={false}
              wheelLodingIndicator={<View />}
              sliderLodingIndicator={<View />}
            />
          </View>

          {/* Current Color Display */}
          <View style={styles.currentColorSection}>
            <Text style={styles.sectionTitle}>Màu đang chọn</Text>
            <View style={styles.currentColorRow}>
              <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
              <TextInput
                style={styles.hexInput}
                value={hexInput}
                onChangeText={handleHexInputChange}
                placeholder="#000000"
                autoCapitalize="characters"
                maxLength={7}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddColor}>
                <MaterialIcons name="add" size={24} color={Colors.whiteColor} />
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preset Colors */}
          <View style={styles.presetSection}>
            <Text style={styles.sectionTitle}>Màu gợi ý</Text>
            <View style={styles.presetGrid}>
              {PRESET_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.presetColor,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedPreset
                  ]}
                  onPress={() => handlePresetColorSelect(color)}
                >
                  {selectedColor === color && (
                    <MaterialIcons name="check" size={16} color={
                      color === '#FFFFFF' ? Colors.blackColor : Colors.whiteColor
                    } />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selected Colors List */}
          {selectedColors.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.sectionTitle}>Màu đã chọn ({selectedColors.length})</Text>
              <View style={styles.selectedColorsList}>
                {selectedColors.map((color, index) => (
                  <View key={index} style={styles.selectedColorItem}>
                    <View style={[styles.selectedColorBox, { backgroundColor: color }]} />
                    <Text style={styles.selectedColorText}>{color}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveColor(color)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="close" size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <Text style={styles.helpText}>
                Các màu này sẽ được thêm vào sản phẩm của bạn
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>Hướng dẫn sử dụng:</Text>
            <Text style={styles.instructionText}>1. Kéo vòng tròn để chọn màu</Text>
            <Text style={styles.instructionText}>2. Điều chỉnh thanh trượt để thay đổi độ sáng</Text>
            <Text style={styles.instructionText}>3. Hoặc nhập trực tiếp mã màu HEX</Text>
            <Text style={styles.instructionText}>4. Nhấn "Thêm" để thêm màu vào danh sách</Text>
            <Text style={styles.instructionText}>5. Nhấn "Xong" khi hoàn thành</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  pickerContainer: {
    padding: 20,
    height: 350,
  },
  currentColorSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 12,
  },
  currentColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  hexInput: {
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.blackColor,
    textAlign: 'center',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  presetSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  presetColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPreset: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  selectedSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  selectedColorsList: {
    marginTop: 8,
  },
  selectedColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  selectedColorBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  selectedColorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  removeButton: {
    padding: 4,
  },
  helpText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  instructions: {
    margin: 20,
    padding: 15,
    backgroundColor: Colors.lightBlue + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightBlue + '30',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    paddingLeft: 10,
  },
});

export default WheelColorPicker;