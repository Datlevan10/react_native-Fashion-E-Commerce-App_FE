# 🚀 ZaloPay Integration Testing Guide

## Quick Start Testing

### Method 1: Navigate to Test Screen
From any screen in your app:
```javascript
// In any React component with navigation prop
<TouchableOpacity onPress={() => navigation.navigate('ZaloPayTestScreen')}>
  <Text>Test ZaloPay</Text>
</TouchableOpacity>
```

### Method 2: Add Quick Test Button (Development Only)
Add to your HomeScreen or any main screen:
```javascript
import QuickTestButton from '../components/Testing/QuickTestButton';

// Inside your component render:
<View style={styles.container}>
  {/* Your existing content */}
  <QuickTestButton navigation={navigation} />
</View>
```

## 🔍 Step-by-Step Testing Process

### 1. **Backend Verification** (First Priority)
Before testing the app, verify your backend is working:

```bash
# Test create payment endpoint
curl -X POST http://192.168.1.58:8080/api/payments/zalopay/create \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "2553",
    "amount": 50000,
    "description": "Test payment",
    "order_id": "test_001",
    "customer_id": "1",
    "redirect_url": "demozpdk://app",
    "callback_url": "http://192.168.1.58:8080/api/payments/zalopay/callback"
  }'
```

**Expected Response:**
```json
{
  "return_code": 1,
  "return_message": "Success",
  "sub_return_code": 1,
  "sub_return_message": "",
  "order_url": "https://sbgateway.zalopay.vn/orderv2/...",
  "zp_trans_token": "...",
  "order_token": "...",
  "app_trans_id": "..."
}
```

### 2. **Frontend API Integration Test**

1. Open ZaloPayTestScreen in your app
2. Load customer ID (should auto-load if logged in)
3. Enter test amount (default: 50000 VND)
4. Run "Test Create Payment"

**What to verify:**
- ✅ API call succeeds (200 status)
- ✅ Response contains `order_url` and `zp_trans_token`
- ✅ No network errors or timeouts

### 3. **ZaloPay Service Integration Test**

1. In ZaloPayTestScreen, run "Test Service Integration"
2. This tests the ZaloPayService wrapper

**What to verify:**
- ✅ ZaloPayService.createPayment() returns success: true
- ✅ Service properly formats API request data
- ✅ Error handling works for invalid data

### 4. **ZaloPay App Opening Test**

1. Run "Test Full Payment Flow" from test screen
2. App should open ZaloPay automatically

**What to verify:**
- ✅ ZaloPay app opens (or browser if app not installed)
- ✅ Payment screen shows correct amount and description
- ✅ Can complete or cancel payment

### 5. **Payment Status Query Test**

1. After creating a payment, run "Test Query Status"
2. Use the order ID from the create payment test

**What to verify:**
- ✅ API returns payment status
- ✅ Status shows as pending (1) or success (1) based on payment completion

### 6. **End-to-End OrderScreen Test**

1. From ZaloPayTestScreen, tap "Test OrderScreen Integration"
2. Complete the order flow with ZaloPay payment method

**What to verify:**
- ✅ Order creation succeeds
- ✅ ZaloPay payment is created automatically
- ✅ ZaloPay app opens from OrderScreen
- ✅ Return to app after payment works
- ✅ Payment status is checked and updated

## 🐛 Common Issues & Solutions

### Issue: "Network Error" or Connection Refused

**Symptoms:**
- API calls fail immediately
- Error message mentions network or connection

**Solutions:**
1. Check backend server is running: `http://192.168.1.58:8080`
2. Verify your device is on the same network
3. Test API endpoint directly in browser or Postman
4. Check firewall settings on backend server

**Test Command:**
```bash
# From your development machine
curl http://192.168.1.58:8080/api/payments/zalopay/create

# From your device (if possible)
# Open browser and go to: http://192.168.1.58:8080
```

### Issue: "MAC Validation Failed" or Invalid Signature

**Symptoms:**
- Backend returns error about MAC validation
- ZaloPay returns authentication errors

**Solutions:**
1. Verify APP_ID matches between frontend and backend
2. Check KEY1 values are identical
3. Ensure MAC generation algorithm matches ZaloPay specs
4. Verify timestamp and data encoding

**Debug Steps:**
1. Log the MAC generation input data on both frontend and backend
2. Compare MAC generation algorithms
3. Test with ZaloPay's official demo credentials first

### Issue: ZaloPay App Doesn't Open

**Symptoms:**
- "Cannot open URL" error
- ZaloPay app doesn't launch

**Solutions:**
1. Install ZaloPay app from App Store/Google Play
2. Verify deep linking configuration in `app.json`
3. Test deep link manually:

**Android Test:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "demozpdk://app" com.happyfield.ecommerce
```

**iOS Test:**
```bash
xcrun simctl openurl booted "demozpdk://app"
```

### Issue: Payment Status Always Pending

**Symptoms:**
- Query status always returns pending
- Callback never received

**Solutions:**
1. Ensure callback URL is publicly accessible
2. Check backend callback endpoint handles POST requests
3. Verify MAC validation in callback handler
4. Test callback endpoint manually

**Callback Test:**
```bash
curl -X POST http://192.168.1.58:8080/api/payments/zalopay/callback \
  -H "Content-Type: application/json" \
  -d '{"data":"test","mac":"test","type":1}'
```

### Issue: App Crashes or Freezes During Payment

**Symptoms:**
- App becomes unresponsive
- Crashes when returning from ZaloPay

**Solutions:**
1. Check React Native logs for errors
2. Verify deep linking handler doesn't have infinite loops
3. Add error boundaries around payment components
4. Test memory usage during payment flow

## 📋 Complete Testing Checklist

### Pre-Testing Setup ✅
- [ ] Backend server running and accessible
- [ ] ZaloPay demo app installed on test device
- [ ] Valid test customer logged into app
- [ ] Network connectivity verified
- [ ] Test screen navigation added to app

### API Integration Tests ✅
- [ ] Create payment API returns 200 status
- [ ] Response contains required fields (order_url, zp_trans_token)
- [ ] Query status API returns expected format
- [ ] Error handling works for invalid data
- [ ] Network timeout handling works

### Frontend Service Tests ✅
- [ ] ZaloPayService.createPayment() succeeds
- [ ] ZaloPayService.openPayment() launches ZaloPay
- [ ] ZaloPayService.queryPaymentStatus() returns status
- [ ] ZaloPayService.parsePaymentResult() handles deep links
- [ ] Error states are handled gracefully

### OrderScreen Integration Tests ✅
- [ ] ZaloPay payment method selectable
- [ ] Order creation with ZaloPay succeeds
- [ ] Payment flow integrates smoothly
- [ ] Error messages are user-friendly
- [ ] Loading states are shown appropriately

### Deep Linking Tests ✅
- [ ] App opens from ZaloPay return URL
- [ ] Payment result is parsed correctly
- [ ] Navigation returns to correct screen
- [ ] Success/failure states handled properly

### Edge Case Tests ✅
- [ ] Invalid payment amounts rejected
- [ ] Duplicate order IDs handled
- [ ] Network interruptions during payment
- [ ] App backgrounded/foregrounded during payment
- [ ] ZaloPay app not installed scenario
- [ ] Payment cancellation in ZaloPay
- [ ] Expired payment URLs

## 🎯 Success Criteria

### ✅ All Tests Pass When:
1. **API Integration**: All 3 backend endpoints work correctly
2. **Service Layer**: ZaloPayService handles all scenarios
3. **UI Integration**: OrderScreen completes payment flow
4. **Deep Linking**: App returns correctly from ZaloPay
5. **Error Handling**: All error scenarios show appropriate messages

### 📊 Performance Benchmarks:
- API response time: < 3 seconds
- ZaloPay app opening: < 2 seconds  
- Payment status query: < 2 seconds
- Deep link return: < 1 second

## 🚀 Production Readiness

Before deploying to production:

### Security Checklist ✅
- [ ] Replace demo credentials with production keys
- [ ] Verify HTTPS is used for all API calls
- [ ] MAC validation is properly implemented
- [ ] No sensitive data logged in production
- [ ] Callback endpoints are secured

### Performance Checklist ✅
- [ ] Payment flow tested with real transaction volumes
- [ ] Memory leaks checked during extended use
- [ ] Network failure scenarios handled gracefully
- [ ] Loading states provide good user experience

### Monitoring Setup ✅
- [ ] Payment success/failure rates tracked
- [ ] API response times monitored
- [ ] Error logging implemented
- [ ] User journey analytics in place

## 📞 Getting Help

### Debug Information to Collect:
1. **Backend Logs**: API request/response logs
2. **Frontend Logs**: React Native console output  
3. **Network Logs**: API call details and timing
4. **Device Info**: OS version, app version, ZaloPay app version
5. **Test Data**: Exact payloads used in failing tests

### Useful Commands:
```bash
# View React Native logs
npx react-native log-android
npx react-native log-ios

# Test deep linking
adb shell am start -W -a android.intent.action.VIEW -d "demozpdk://app"

# Check network connectivity
ping 192.168.1.58

# Test backend endpoint
curl -v http://192.168.1.58:8080/api/payments/zalopay/create
```

---

## 🎉 Next Steps After All Tests Pass

1. **Deploy to Staging**: Test with production-like environment
2. **User Acceptance Testing**: Have real users test the payment flow  
3. **Performance Testing**: Test under load with multiple concurrent payments
4. **Documentation**: Update user guides and technical documentation
5. **Monitoring**: Set up production monitoring and alerting

**Good luck with your ZaloPay integration testing! 🚀**