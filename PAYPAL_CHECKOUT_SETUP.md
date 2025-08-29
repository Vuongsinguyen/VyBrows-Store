# PayPal Checkout Integration Setup Guide

This guide will help you integrate PayPal Checkout into your VyBrows-Store for secure online payments.

## 📋 Overview

The PayPal integration includes:
- **PayPalCheckoutButton** - React component for PayPal payments
- **createPayPalOrder** - Serverless function to create PayPal orders
- **capturePayPalOrder** - Serverless function to capture payments
- **CartContext integration** - Automatic cart clearing after successful payment

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install @paypal/paypal-js
```

### Step 2: Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Click "Apps & Credentials" in the left sidebar
4. Click "Create App"
5. Choose "Merchant" as the app type
6. Fill in:
   - **App Name**: `VyBrows Store`
   - **Sandbox**: Select for testing (recommended first)
7. Click "Create App"

### Step 3: Get API Credentials

After creating the app, you'll see:
- **Client ID**: Copy this for your environment variables
- **Secret**: Copy this for your environment variables

### Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=AVjE6bc3p6wzg0YikVzjky77sPfwCYtGR_5bIsVXMgFDlLuSDwnIBbtVc_d6PmXlCrta7HWAk45302vV
PAYPAL_CLIENT_SECRET=EOZNJOZ6JD5UGmj3eIYr9RqD41wc7nBlFe5rWtOk0V9uZdEwOmEI5iJbDUL9ol_8M9RF6XknHyzM75TE
PAYPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AVjE6bc3p6wzg0YikVzjky77sPfwCYtGR_5bIsVXMgFDlLuSDwnIBbtVc_d6PmXlCrta7HWAk45302vV
NEXT_PUBLIC_SITE_URL=https://shop.vybrows-academy.com
```

**Important Notes:**
- Use `sandbox` for testing, `production` for live payments
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is exposed to the client-side
- `PAYPAL_CLIENT_SECRET` must remain server-side only

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Add items to your cart
3. Click "Proceed to Checkout"
4. Select "PayPal Checkout" payment method
5. Click the PayPal button to test the flow

## 🔧 Component Details

### PayPalCheckoutButton

**Location:** `components/cart/paypal-checkout-button.tsx`

**Features:**
- Loads PayPal JavaScript SDK dynamically
- Creates PayPal orders using your serverless function
- Handles payment approval and capture
- Shows loading states and error messages
- Automatically clears cart on success

**Props:**
```typescript
interface PayPalCheckoutButtonProps {
  onSuccess?: (transactionId: string, amount: string, status: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}
```

### Serverless Functions

#### createPayPalOrder (`/api/paypal/create-order.ts`)

**Purpose:** Creates a PayPal order for payment processing

**Request Body:**
```typescript
{
  "item": {
    "title": "Product Name",
    "quantity": 1,
    "price": "29.99",
    "currency": "USD"
  },
  "total": "29.99",
  "currency": "USD"
}
```

**Response:**
```typescript
{
  "id": "5O190127TN364715T",
  "status": "CREATED",
  "links": [...]
}
```

#### capturePayPalOrder (`/api/paypal/capture-order.ts`)

**Purpose:** Captures payment after customer approval

**Request Body:**
```typescript
{
  "orderId": "5O190127TN364715T"
}
```

**Response:**
```typescript
{
  "id": "8AC12359NE2342313",
  "status": "COMPLETED",
  "purchase_units": [
    {
      "amount": {
        "currency_code": "USD",
        "value": "29.99"
      },
      "payments": {
        "captures": [
          {
            "id": "8AC12359NE2342313",
            "status": "COMPLETED",
            "amount": {
              "currency_code": "USD",
              "value": "29.99"
            }
          }
        ]
      }
    }
  ]
}
```

## 🔒 Security Best Practices

### Environment Variables
- ✅ **PAYPAL_CLIENT_ID**: Public, used client-side
- ✅ **PAYPAL_CLIENT_SECRET**: Private, server-side only
- ✅ **PAYPAL_ENVIRONMENT**: Controls sandbox/production mode

### API Security
- Server-side functions validate all inputs
- PayPal credentials never exposed to client
- HTTPS required for production
- CORS properly configured

### Payment Flow
- Orders created server-side with proper validation
- Payment capture requires valid order ID
- Transaction details logged securely
- Cart cleared only after successful capture

## 🧪 Testing

### Sandbox Testing

1. Use `PAYPAL_ENVIRONMENT=sandbox` in your environment
2. Create a PayPal sandbox account at [PayPal Developer](https://developer.paypal.com/)
3. Use sandbox client ID and secret
4. Test payments won't process real money

### Test Cards

PayPal provides test cards for sandbox:
- **Success**: Any valid card number (e.g., 4111111111111111)
- **Decline**: Use 4000000000000002
- **Error**: Use 4000000000000119

## 🎯 Production Deployment

### For Vercel

1. Add environment variables in Vercel dashboard:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_ENVIRONMENT=production`
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `NEXT_PUBLIC_SITE_URL`

2. Update PayPal app settings:
   - Change environment to "Live"
   - Update return/cancel URLs to your production domain

### For Netlify

1. Add environment variables in Netlify dashboard
2. Update build settings if needed
3. Configure domain settings

## 🔧 Troubleshooting

### Common Issues

1. **"PayPal SDK not loading"**
   - Check `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
   - Verify client ID is valid for your environment

2. **"Order creation failed"**
   - Check server logs for PayPal API errors
   - Verify `PAYPAL_CLIENT_SECRET` is correct
   - Ensure environment variables are loaded

3. **"Payment capture failed"**
   - Check if order was already captured
   - Verify order ID is valid
   - Check PayPal API status

4. **"CORS errors"**
   - Ensure proper CORS headers in API responses
   - Check if API routes are correctly configured

### Debug Mode

Add detailed logging by setting:
```bash
NODE_ENV=development
```

## 📊 Payment Flow

```
1. User clicks PayPal button
2. Client calls /api/paypal/create-order
3. Server creates PayPal order via REST API
4. PayPal returns order ID to client
5. User redirected to PayPal for approval
6. User approves payment on PayPal
7. PayPal redirects back to your site
8. Client calls /api/paypal/capture-order
9. Server captures payment via REST API
10. Cart cleared, success message shown
```

## 🎨 Customization

### Styling the PayPal Button

```typescript
// In PayPalCheckoutButton component
window.paypal.Buttons({
  style: {
    layout: 'vertical',
    color: 'blue',
    shape: 'rect',
    label: 'paypal'
  },
  // ... other options
})
```

### Custom Success Handling

```typescript
<PayPalCheckoutButton
  onSuccess={(transactionId, amount, status) => {
    // Custom success logic
    console.log('Payment successful!', { transactionId, amount, status });
    // Send confirmation email, update analytics, etc.
  }}
  onError={(error) => {
    // Custom error handling
    console.error('Payment failed:', error);
    // Show custom error UI
  }}
/>
```

## 📞 Support

### PayPal Resources
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal REST API Reference](https://developer.paypal.com/api/rest/)
- [PayPal SDK Documentation](https://developer.paypal.com/sdk/js/)

### Integration Issues
1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify all environment variables are set
4. Test with PayPal sandbox first

## 🚀 Advanced Features

### Multiple Items Support

Currently processes only the first cart item. To support multiple items:

```typescript
// Modify createPayPalOrder to handle multiple items
const orderData = {
  purchase_units: [
    {
      amount: {
        currency_code: currency,
        value: total,
        breakdown: {
          item_total: {
            currency_code: currency,
            value: total
          }
        }
      },
      items: cartItems.map(item => ({
        name: item.title.substring(0, 127),
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: currency,
          value: item.price
        }
      }))
    }
  ]
};
```

### Webhook Integration

Add PayPal webhooks for real-time payment notifications:

```typescript
// Handle PayPal webhooks
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body;
    // Process webhook events (PAYMENT.CAPTURE.COMPLETED, etc.)
  }
}
```

The PayPal integration is now ready! 🎉 Secure payments with automatic cart management and comprehensive error handling.
