import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Colors from '../../styles/Color';

const { width } = Dimensions.get('window');

// Extended color palette with common colors
const COLOR_PALETTE = [
  // Grayscale
  { name: 'Đen', hex: '#000000' },
  { name: 'Xám đậm', hex: '#303030' },
  { name: 'Xám', hex: '#606060' },
  { name: 'Xám nhạt', hex: '#909090' },
  { name: 'Xám trắng', hex: '#C0C0C0' },
  { name: 'Trắng xám', hex: '#E0E0E0' },
  { name: 'Trắng', hex: '#FFFFFF' },
  
  // Reds
  { name: 'Đỏ đậm', hex: '#8B0000' },
  { name: 'Đỏ', hex: '#FF0000' },
  { name: 'Đỏ nhạt', hex: '#FF6B6B' },
  { name: 'Hồng đậm', hex: '#C71585' },
  { name: 'Hồng', hex: '#FF69B4' },
  { name: 'Hồng nhạt', hex: '#FFB6C1' },
  
  // Blues
  { name: 'Xanh navy', hex: '#000080' },
  { name: 'Xanh dương đậm', hex: '#0000CD' },
  { name: 'Xanh dương', hex: '#0000FF' },
  { name: 'Xanh biển', hex: '#2C76CA' },
  { name: 'Xanh da trời', hex: '#87CEEB' },
  { name: 'Xanh nhạt', hex: '#ADD8E6' },
  
  // Greens
  { name: 'Xanh lá đậm', hex: '#006400' },
  { name: 'Xanh lá', hex: '#008000' },
  { name: 'Xanh lá cây', hex: '#00FF00' },
  { name: 'Xanh mint', hex: '#00FF7F' },
  { name: 'Xanh olive', hex: '#808000' },
  { name: 'Xanh nhạt', hex: '#90EE90' },
  
  // Yellows & Oranges
  { name: 'Vàng đậm', hex: '#FFD700' },
  { name: 'Vàng', hex: '#FFFF00' },
  { name: 'Vàng nhạt', hex: '#FFFFE0' },
  { name: 'Cam đậm', hex: '#FF8C00' },
  { name: 'Cam', hex: '#FFA500' },
  { name: 'Cam nhạt', hex: '#FFE4B5' },
  
  // Purples
  { name: 'Tím đậm', hex: '#4B0082' },
  { name: 'Tím', hex: '#800080' },
  { name: 'Tím nhạt', hex: '#DDA0DD' },
  { name: 'Violet', hex: '#EE82EE' },
  
  // Browns
  { name: 'Nâu đậm', hex: '#654321' },
  { name: 'Nâu', hex: '#964B00' },
  { name: 'Nâu nhạt', hex: '#D2691E' },
  { name: 'Be', hex: '#F5DEB3' },
  { name: 'Kem', hex: '#FFFDD0' },
];

const SimpleColorPicker = ({ visible, onSelectColor, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);

  if (!visible) return null;

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const handleCopyColor = async (hex) => {
    await Clipboard.setString(hex);
    setCopiedColor(hex);
    Alert.alert(
      'Đã sao chép!',
      `Mã màu ${hex} đã được sao chép.\nBạn có thể dán vào ô nhập màu.`,
      [{ text: 'OK' }]
    );
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDone = () => {
    if (selectedColor) {
      onSelectColor(selectedColor.hex);
    }
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chọn Màu Sắc</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
        </View>

        {/* Selected Color Display */}
        {selectedColor && (
          <View style={styles.selectedColorDisplay}>
            <View style={[styles.selectedColorBox, { backgroundColor: selectedColor.hex }]} />
            <View style={styles.selectedColorInfo}>
              <Text style={styles.selectedColorName}>{selectedColor.name}</Text>
              <Text style={styles.selectedColorHex}>{selectedColor.hex}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopyColor(selectedColor.hex)}
            >
              <Feather name="copy" size={20} color={Colors.primary} />
              <Text style={styles.copyButtonText}>Sao chép</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            1. Chọn màu bạn muốn từ bảng màu bên dưới
          </Text>
          <Text style={styles.instructionText}>
            2. Nhấn "Sao chép" để copy mã màu
          </Text>
          <Text style={styles.instructionText}>
            3. Dán mã màu vào ô nhập liệu
          </Text>
        </View>

        {/* Color Palette Grid */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.colorGrid}>
            {COLOR_PALETTE.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={styles.colorItem}
                onPress={() => handleSelectColor(color)}
              >
                <View 
                  style={[
                    styles.colorBox, 
                    { backgroundColor: color.hex },
                    selectedColor?.hex === color.hex && styles.selectedColorBorder,
                    copiedColor === color.hex && styles.copiedColorBorder
                  ]}
                >
                  {selectedColor?.hex === color.hex && (
                    <View style={styles.checkmark}>
                      <MaterialIcons name="check" size={20} color={
                        color.hex === '#FFFFFF' || color.hex === '#FFFFE0' || color.hex === '#FFFDD0' 
                          ? Colors.blackColor 
                          : Colors.whiteColor
                      } />
                    </View>
                  )}
                </View>
                <Text style={styles.colorName}>{color.name}</Text>
                <Text style={styles.colorHex}>{color.hex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Đóng</Text>
          </TouchableOpacity>
          {selectedColor && (
            <TouchableOpacity
              style={[styles.actionButton, styles.useButton]}
              onPress={handleDone}
            >
              <Text style={styles.useButtonText}>Dùng màu này</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  selectedColorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.lightGray + '20',
    borderRadius: 10,
  },
  selectedColorBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  selectedColorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedColorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  selectedColorHex: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  instructions: {
    padding: 20,
    backgroundColor: Colors.lightBlue + '20',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.blackColor,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  colorItem: {
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorBorder: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  copiedColorBorder: {
    borderWidth: 3,
    borderColor: Colors.success,
  },
  checkmark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: 12,
    color: Colors.blackColor,
    marginTop: 5,
    textAlign: 'center',
  },
  colorHex: {
    fontSize: 10,
    color: Colors.grayColor,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  actionButton: {
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
  useButton: {
    backgroundColor: Colors.primary,
  },
  useButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SimpleColorPicker;