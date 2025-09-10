# ZaloPay Integration Guide

This document outlines the ZaloPay payment integration implemented in the Happy Field Fashion E-Commerce App.

## Overview

The ZaloPay integration allows customers to pay for their orders using ZaloPay digital wallet. The implementation includes:

1. **Frontend Integration**: React Native app with ZaloPay SDK integration
2. **Backend Requirements**: API endpoints for payment processing
3. **Deep Linking**: Handle payment results when returning from ZaloPay app

## Frontend Implementation

### Files Modified/Created:

1. **`/src/services/ZaloPayService.js`** - ZaloPay service class
2. **`/src/api/ApiService.js`** - Added ZaloPay API methods
3. **`/src/screens/OrderScreen/index.js`** - Updated order creation with ZaloPay
4. **`/src/index.js`** - Added deep linking support
5. **`app.json`** - Added deep link configuration
6. **Other components** - Fixed image URL issues

### How It Works:

1. Customer selects ZaloPay as payment method in OrderScreen
2. App creates order via backend API
3. App requests ZaloPay payment creation via backend
4. App opens ZaloPay app for payment
5. ZaloPay redirects back to app with payment result
6. App handles the result and updates order status

## Backend Requirements

### Required API Endpoints:

#### 1. Create ZaloPay Payment
```http
POST /api/payments/zalopay/create
```

**Request Body:**
```json
{
  "app_id": "2553",
  "amount": 150000,
  "description": "Payment for order #12345",
  "order_id": "12345",
  "customer_id": "67890",
  "redirect_url": "demozpdk://app",
  "callback_url": "https://yourdomain.com/api/zalopay/callback"
}
```

**Response:**
```json
{
  "success": true,
  "order_url": "https://sbgateway.zalopay.vn/order/token/...",
  "zp_trans_token": "...",
  "order_token": "..."
}
```

#### 2. Query ZaloPay Payment Status
```http
POST /api/payments/zalopay/query
```

**Request Body:**
```json
{
  "app_trans_id": "order_12345_timestamp"
}
```

**Response:**
```json
{
  "return_code": 1,
  "return_message": "Success",
  "sub_return_code": 1,
  "sub_return_message": "",
  "is_processing": false,
  "amount": 150000,
  "zp_trans_id": "..."
}
```

#### 3. ZaloPay Callback Handler
```http
POST /api/payments/zalopay/callback
```

**Request Body:** (From ZaloPay)
```json
{
  "data": "...",
  "mac": "..."
}
```

## ZaloPay Configuration

### Demo Configuration (for testing):
- **App ID**: `2553`
- **Key1**: `PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL`
- **Key2**: `kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz`
- **Endpoint**: `https://sb-openapi.zalopay.vn/v2/create`

### Production Configuration:
You need to:
1. Register with ZaloPay for production credentials
2. Replace demo credentials with production ones
3. Update endpoint URLs to production ZaloPay API

## Deep Linking Setup

### URL Schemes:
- `demozpdk://` - ZaloPay demo return URL
- `happyfield://` - Your app's custom scheme

### Supported Routes:
- `demozpdk://app` - ZaloPay payment return
- `happyfield://order` - Navigate to order screen
- `happyfield://orders` - Navigate to orders list
- `happyfield://home` - Navigate to home screen

## Testing

### Test Flow:
1. Add items to cart
2. Go to OrderScreen
3. Fill shipping information
4. Select "ZaloPay" as payment method
5. Click "Place Order"
6. App should open ZaloPay (or browser if ZaloPay not installed)
7. Complete payment in ZaloPay
8. Return to app to see result

### Test Cards (ZaloPay Sandbox):
- Use ZaloPay sandbox environment for testing
- No real money transactions in sandbox mode

## Security Considerations

1. **API Keys**: Store securely on backend, never expose in frontend
2. **MAC Verification**: Always verify MAC in callback handler
3. **Order Validation**: Validate order exists and amount matches
4. **HTTPS**: Use HTTPS for all API communications
5. **Callback Security**: Validate callback signature from ZaloPay

## Error Handling

The integration handles various error scenarios:
- Network connection issues
- ZaloPay app not installed
- Payment cancellation
- Invalid payment data
- Backend API errors

## Integration Status

✅ **Completed:**
- ZaloPay service implementation
- Order screen integration
- Deep linking setup
- Payment flow UI
- Error handling

⚠️ **Backend Required:**
- ZaloPay API endpoints
- Payment webhook handling
- Order status updates

## Next Steps

1. **Backend Implementation**: Implement the required API endpoints
2. **Testing**: Test with ZaloPay sandbox environment
3. **Production Setup**: Get production ZaloPay credentials
4. **QR Code Payment**: Implement QR code payment (separate feature)

## Support

For ZaloPay integration support:
- [ZaloPay Developer Documentation](https://docs.zalopay.vn/)
- [ZaloPay SDK Documentation](https://docs.zalopay.vn/docs/sdk/)

For technical issues with this implementation, refer to the source code comments and console logs.