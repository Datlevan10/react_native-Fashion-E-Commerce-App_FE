import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Clipboard,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
import Colors from '../../styles/Color';

const { width, height } = Dimensions.get('window');

// Predefined color palette for quick selection
const PRESET_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Dark Gray', hex: '#303030' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Light Gray', hex: '#C0C0C0' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Navy', hex: '#2C76CA' },
  { name: 'Light Blue', hex: '#87CEEB' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#964B00' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Teal', hex: '#008080' },
];

const ColorPickerModal = ({ visible, onClose, onSelectColors, initialColors = '' }) => {
  const [selectedColor, setSelectedColor] = useState('#303030');
  const [colorInput, setColorInput] = useState('#303030');
  const [colorsList, setColorsList] = useState([]);
  const [showColorWheel, setShowColorWheel] = useState(true); // Show color wheel by default

  useEffect(() => {
    // Parse initial colors
    if (initialColors) {
      const colors = initialColors.split(',').map(c => c.trim()).filter(Boolean);
      setColorsList(colors);
    }
  }, [initialColors]);

  const isValidHexColor = (color) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  const handleColorInputChange = (text) => {
    // Auto-add # if not present
    if (text && !text.startsWith('#')) {
      text = '#' + text;
    }
    setColorInput(text);
    
    // Update selected color if valid
    if (isValidHexColor(text)) {
      setSelectedColor(text);
    }
  };

  const handleAddColor = () => {
    const colorToAdd = colorInput.trim();
    
    // Validate color
    if (!isValidHexColor(colorToAdd)) {
      Alert.alert('Invalid Color', 'Please enter a valid hex color code (e.g., #303030)');
      return;
    }
    
    // Check if color already exists
    if (colorsList.includes(colorToAdd)) {
      Alert.alert('Duplicate Color', 'This color has already been added');
      return;
    }
    
    // Add color to list
    setColorsList([...colorsList, colorToAdd]);
    setColorInput('');
  };

  const handleRemoveColor = (index) => {
    const newColors = colorsList.filter((_, i) => i !== index);
    setColorsList(newColors);
  };

  const handlePresetColorSelect = (hexColor) => {
    setColorInput(hexColor);
    setSelectedColor(hexColor);
  };

  const handleCopyColor = async (color) => {
    await Clipboard.setString(color);
    Alert.alert('Copied!', `Color ${color} copied to clipboard`);
  };

  const handleDone = () => {
    const colorsString = colorsList.join(', ');
    onSelectColors(colorsString);
    onClose();
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setColorInput(color.toUpperCase());
  };

  const handleAddSelectedColor = () => {
    if (!colorsList.includes(selectedColor)) {
      setColorsList([...colorsList, selectedColor]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chọn Màu Sắc</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors.blackColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Color Wheel Picker - Primary Selection Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn màu từ bảng màu</Text>
              <View style={styles.colorWheelContainer}>
                <ColorPicker
                  color={selectedColor}
                  onColorChange={handleColorChange}
                  thumbSize={30}
                  sliderSize={30}
                  noSnap={true}
                  row={false}
                  style={styles.colorWheel}
                />
              </View>
              
              {/* Live Color Preview and Code */}
              <View style={styles.selectedColorSection}>
                <View style={styles.selectedColorRow}>
                  <View 
                    style={[styles.largeColorPreview, { backgroundColor: selectedColor }]}
                  />
                  <View style={styles.selectedColorInfo}>
                    <Text style={styles.colorCodeLabel}>Mã màu đã chọn:</Text>
                    <Text style={styles.colorCodeText}>{colorInput}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.copyColorButton}
                    onPress={() => handleCopyColor(selectedColor)}
                  >
                    <Feather name="copy" size={20} color={Colors.primary} />
                    <Text style={styles.copyButtonText}>Sao chép</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.addSelectedColorButton}
                  onPress={handleAddSelectedColor}
                >
                  <MaterialIcons name="add-circle" size={20} color={Colors.whiteColor} />
                  <Text style={styles.addSelectedColorText}>Thêm màu này</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preset Colors */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Màu gợi ý</Text>
              <View style={styles.presetColorsContainer}>
                {PRESET_COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.presetColorItem}
                    onPress={() => handlePresetColorSelect(color.hex)}
                  >
                    <View 
                      style={[styles.presetColor, { backgroundColor: color.hex }]}
                    />
                    <Text style={styles.presetColorName}>{color.name}</Text>
                    <TouchableOpacity 
                      onPress={() => handleCopyColor(color.hex)}
                      style={styles.copyButton}
                    >
                      <Feather name="copy" size={14} color={Colors.grayColor} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Selected Colors List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Màu đã chọn ({colorsList.length})</Text>
              {colorsList.length === 0 ? (
                <Text style={styles.emptyText}>Chưa chọn màu nào</Text>
              ) : (
                <View style={styles.selectedColorsContainer}>
                  {colorsList.map((color, index) => (
                    <View key={index} style={styles.selectedColorItem}>
                      <View 
                        style={[styles.selectedColorPreview, { backgroundColor: color }]}
                      />
                      <Text style={styles.selectedColorText}>{color}</Text>
                      <TouchableOpacity 
                        onPress={() => handleCopyColor(color)}
                        style={styles.copyButton}
                      >
                        <Feather name="copy" size={16} color={Colors.grayColor} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleRemoveColor(index)}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="close" size={18} color={Colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.footerButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.footerButton, styles.doneButton]}
              onPress={handleDone}
            >
              <Text style={styles.doneButtonText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  selectedColorSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.lightGray + '20',
    borderRadius: 10,
  },
  selectedColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  largeColorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginRight: 15,
  },
  selectedColorInfo: {
    flex: 1,
  },
  colorCodeLabel: {
    fontSize: 12,
    color: Colors.grayColor,
    marginBottom: 4,
  },
  colorCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  copyColorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  copyButtonText: {
    marginLeft: 5,
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  addSelectedColorButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  addSelectedColorText: {
    marginLeft: 8,
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.blackColor,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 5,
  },
  colorWheelContainer: {
    height: 250,
    paddingVertical: 10,
  },
  colorWheel: {
    flex: 1,
  },
  presetColorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  presetColorItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: '1.5%',
  },
  presetColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 5,
  },
  presetColorName: {
    fontSize: 12,
    color: Colors.grayColor,
    textAlign: 'center',
  },
  copyButton: {
    padding: 5,
  },
  selectedColorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray + '20',
    borderRadius: 20,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  selectedColorText: {
    fontSize: 14,
    color: Colors.blackColor,
    marginRight: 5,
  },
  removeButton: {
    marginLeft: 5,
  },
  emptyText: {
    color: Colors.grayColor,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: Colors.lightGray + '30',
  },
  cancelButtonText: {
    color: Colors.blackColor,
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: Colors.primary,
  },
  doneButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ColorPickerModal;