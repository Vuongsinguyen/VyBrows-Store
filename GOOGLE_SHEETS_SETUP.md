# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for order tracking in your VyBrows-Store.

## 📋 Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with the Google Sheets API enabled
2. **Service Account**: A service account with access to Google Sheets
3. **Google Sheet**: A spreadsheet to store orders

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in:
   - **Service account name**: `vybrows-store-orders`
   - **Service account ID**: `vybrows-store-orders` (auto-generated)
   - **Description**: `Service account for VyBrows Store order tracking`
4. Click "Create and Continue"
5. Skip the optional steps (you can set permissions later)
6. Click "Done"

### Step 3: Generate Service Account Key

1. In the "Credentials" page, find your service account
2. Click on the service account name
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the JSON file (keep it secure!)

### Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "VyBrows Store Orders"
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
   The `SPREADSHEET_ID` is the long string between `/d/` and `/edit`

### Step 5: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Paste the service account email (from the JSON file: `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

### Step 6: Configure Environment Variables

Add these to your `.env.local` file (create if it doesn't exist):

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important**: The private key should be on a single line with `\n` for line breaks, or you can use a multi-line format:

```bash
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...
-----END PRIVATE KEY-----"
```

### Step 7: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit the test page: `http://localhost:3000/test`

3. Click "Test Google Sheets Order" to test the Google Sheets integration

4. Check your Google Sheet - you should see a new row with the test order data (only name and email required)

## 📊 Google Sheet Structure

The integration will automatically create these columns in your sheet:

| Column | Description |
|--------|-------------|
| Timestamp | Order timestamp (ISO format) |
| Customer Name | Customer's full name |
| Customer Email | Customer's email address |
| Items | JSON string of order items |
| Total | Total order amount |

**Note**: The simplified structure only requires customer name and email, making the checkout process faster and more privacy-focused.

## 🔧 Troubleshooting

### Common Issues:

1. **"Missing Google Sheets configuration"**
   - Check that all environment variables are set correctly
   - Ensure the `.env.local` file is in your project root

2. **"The caller does not have permission"**
   - Make sure you shared the Google Sheet with the service account email
   - Verify the service account has "Editor" permissions

3. **"Invalid private key"**
   - Ensure the private key is properly formatted with correct line breaks
   - Don't include extra quotes or characters

4. **"Spreadsheet not found"**
   - Double-check the spreadsheet ID
   - Make sure the service account has access to the spreadsheet

### Debug Mode:

Add this to your `.env.local` for detailed logging:
```bash
NODE_ENV=development
```

## 🎯 Usage in Production

### For Vercel Deployment:

1. Add the environment variables in your Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable from your `.env.local`

2. Redeploy your application

### For Netlify Deployment:

1. Add the environment variables in your Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add each variable from your `.env.local`

2. Trigger a new deploy

## 📈 Advanced Features

### Custom Status Updates

You can extend the admin panel to update order status:

```typescript
// Example: Update order status in Google Sheets
async function updateOrderStatus(orderId: string, status: string) {
  const sheets = await getGoogleSheetsClient();

  // Find the row with the order ID and update status
  // Implementation depends on your specific needs
}
```

### Email Notifications

Integrate with email services to send order confirmations:

```typescript
// Example: Send confirmation email
import nodemailer from 'nodemailer';

async function sendOrderConfirmation(orderData: OrderData) {
  // Configure your email service (SendGrid, Mailgun, etc.)
  // Send email with order details
}
```

### Analytics

Add analytics to track order metrics:

```typescript
// Example: Track order analytics
async function trackOrderAnalytics(orderData: OrderData) {
  // Send data to analytics service (Google Analytics, Mixpanel, etc.)
}
```

## 🔒 Security Best Practices

1. **Never commit service account keys** to version control
2. **Use environment variables** for all sensitive data
3. **Limit service account permissions** to only the necessary spreadsheet
4. **Rotate keys regularly** for security
5. **Monitor API usage** in Google Cloud Console

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the service account has proper permissions
4. Test with the `/test` page to isolate issues

The integration is now ready to automatically save all customer orders to your Google Sheet! 🎉
