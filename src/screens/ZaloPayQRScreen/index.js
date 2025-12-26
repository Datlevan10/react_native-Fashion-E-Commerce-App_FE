import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Colors from '../../styles/Color';

const { width, height } = Dimensions.get('window');

const ZaloPayQRScreen = ({ navigation, route }) => {
  const { orderId, zaloPayUrl, amount, appTransId } = route.params;
  const [loading, setLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);
  
  // Convert openinapp URL to QR display URL for web display
  const qrDisplayUrl = zaloPayUrl.replace('openinapp', 'pay/v2/qr');
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(zaloPayUrl);
    Alert.alert('Đã sao chép', 'Link thanh toán đã được sao chép vào clipboard');
  };
  
  const handleOpenInBrowser = () => {
    // Open the QR URL in external browser
    Linking.openURL(qrDisplayUrl);
  };
  
  const handleOpenZaloPayApp = async () => {
    // Try to open ZaloPay QC app with different schemes
    const appSchemes = [
      'zalopayqc://',
      'zalopay-sandbox://',
      'demozpdk://',
      'zalopay://'
    ];
    
    let opened = false;
    for (const scheme of appSchemes) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          await Linking.openURL(scheme);
          opened = true;
          break;
        }
      } catch (err) {
        console.log(`Cannot open ${scheme}:`, err);
      }
    }
    
    if (!opened) {
      Alert.alert(
        'Không thể mở ứng dụng',
        'Vui lòng cài đặt ứng dụng ZaloPay QC hoặc ZaloPay Sandbox để quét mã',
        [
          { text: 'OK' }
        ]
      );
    }
  };
  
  const handleWebViewLoad = () => {
    setLoading(false);
  };
  
  const handleWebViewError = (error) => {
    console.error('WebView error:', error);
    setWebViewError(true);
    setLoading(false);
  };
  
  const handlePaymentComplete = () => {
    // Navigate to payment status screen
    navigation.replace('ZaloPayStatusScreen', {
      orderId: orderId,
      appTransId: appTransId,
      amount: amount,
      description: `Thanh toán đơn hàng #${orderId}`,
    });
  };
  
  const injectedJavaScript = `
    // Hide unnecessary elements and adjust layout
    (function() {
      const style = document.createElement('style');
      style.innerHTML = \`
        /* Hide header and footer */
        .gateway-header,
        .gateway-footer,
        .header-section,
        .footer-section,
        .navbar,
        .topbar,
        nav,
        header,
        footer { 
          display: none !important; 
        }
        
        /* Adjust body and container */
        body { 
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        
        /* Center QR code content */
        .qr-container,
        .payment-container,
        .qr-code-container,
        .qr-wrapper {
          margin: 20px auto !important;
          text-align: center !important;
        }
        
        /* Ensure QR code is visible and centered */
        img[src*="qr"],
        canvas,
        .qr-code {
          margin: 0 auto !important;
          display: block !important;
          max-width: 280px !important;
          height: auto !important;
        }
        
        /* Style payment info */
        .payment-info,
        .amount-info {
          text-align: center !important;
          padding: 10px !important;
        }
        
        /* Adjust font sizes for mobile */
        * {
          max-width: 100% !important;
        }
        
        /* Hide unnecessary buttons that might interfere */
        .download-app,
        .app-download {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);
      
      // Handle all clicks on links
      document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
          target = target.parentElement;
        }
        
        if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href) {
            if (href.includes('zalopay') || href.includes('zpdk')) {
              e.preventDefault();
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'open_zalopay',
                url: href 
              }));
            }
          }
        }
      });
      
      // Also handle button clicks that might open the app
      const buttons = document.querySelectorAll('button, .btn');
      buttons.forEach(button => {
        const text = button.innerText.toLowerCase();
        if (text.includes('zalopay') || text.includes('mở ứng dụng')) {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            // Try to find any zalopay URL on the page
            const links = document.querySelectorAll('a[href*="zalopay"], a[href*="zpdk"]');
            if (links.length > 0) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'open_zalopay',
                url: links[0].href 
              }));
            }
          });
        }
      });
    })();
    
    true; // Required for injectedJavaScript to work
  `;
  
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'open_zalopay') {
        // Try multiple URL schemes for ZaloPay app
        const tryOpeningApp = async () => {
          const schemes = [
            data.url, // Original URL
            data.url.replace('zalopay://', 'zalopay-sandbox://'), // Sandbox scheme
            data.url.replace('zalopay://', 'demozpdk://'), // Demo scheme
            data.url.replace('zalopay://', 'zalopayqc://'), // QC app scheme
          ];
          
          let opened = false;
          for (const scheme of schemes) {
            try {
              const canOpen = await Linking.canOpenURL(scheme);
              if (canOpen) {
                await Linking.openURL(scheme);
                opened = true;
                break;
              }
            } catch (err) {
              console.log(`Cannot open ${scheme}:`, err);
            }
          }
          
          if (!opened) {
            Alert.alert(
              'Không thể mở ZaloPay',
              'Vui lòng quét mã QR bằng ứng dụng ZaloPay hoặc sao chép link để thanh toán',
              [
                { text: 'Sao chép link', onPress: handleCopyLink },
                { text: 'OK', style: 'cancel' }
              ]
            );
          }
        };
        
        tryOpeningApp();
      }
    } catch (error) {
      console.log('Message parsing error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.blackColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán ZaloPay</Text>
        <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
          <Feather name="copy" size={20} color={Colors.blackColor} />
        </TouchableOpacity>
      </View>
      
      {/* Order Info Bar */}
      <View style={styles.orderInfo}>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Mã đơn:</Text>
          <Text style={styles.orderValue}>#{orderId}</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Số tiền:</Text>
          <Text style={styles.orderAmount}>
            {amount ? amount.toLocaleString('vi-VN') : '0'} đ
          </Text>
        </View>
      </View>
      
      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {loading && !webViewError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Đang tải mã QR thanh toán...</Text>
          </View>
        )}
        
        {webViewError ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={Colors.danger} />
            <Text style={styles.errorText}>Không thể tải trang thanh toán</Text>
            <Text style={styles.errorSubtext}>Vui lòng thử lại hoặc sao chép link</Text>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setWebViewError(false);
                setLoading(true);
              }}
            >
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.copyLinkButton}
              onPress={handleCopyLink}
            >
              <Feather name="copy" size={16} color={Colors.primary} />
              <Text style={styles.copyLinkText}>Sao chép link</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ uri: qrDisplayUrl }}
            style={styles.webView}
            onLoadEnd={handleWebViewLoad}
            onError={handleWebViewError}
            injectedJavaScript={injectedJavaScript}
            onMessage={handleMessage}
            startInLoadingState={false}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={handlePaymentComplete}
        >
          <MaterialIcons name="check-circle" size={20} color={Colors.whiteColor} />
          <Text style={styles.statusButtonText}>Đã thanh toán xong</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleOpenZaloPayApp}
          >
            <MaterialIcons name="qr-code-scanner" size={16} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Mở ZaloPay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleOpenInBrowser}
          >
            <Feather name="external-link" size={16} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Trình duyệt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleCopyLink}
          >
            <Feather name="copy" size={16} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Sao chép</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.helpText}>
          Quét mã QR bằng ứng dụng ZaloPay để thanh toán
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    padding: 5,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 13,
    color: Colors.grayColor,
    marginRight: 5,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: Colors.grayColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    marginTop: 15,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 8,
    marginBottom: 25,
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 15,
  },
  retryText: {
    color: Colors.whiteColor,
    fontWeight: '600',
    fontSize: 15,
  },
  copyLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  copyLinkText: {
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  bottomActions: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.whiteColor,
  },
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: '#f8f9fa',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.grayColor,
    fontStyle: 'italic',
  },
});

export default ZaloPayQRScreen;