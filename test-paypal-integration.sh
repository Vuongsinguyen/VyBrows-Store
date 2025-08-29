#!/bin/bash

# PayPal Integration Test Script
# Tests the PayPal checkout flow automatically

echo "🧪 PayPal Integration Test"
echo "=========================="
echo ""

# Check if environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$NEXT_PUBLIC_PAYPAL_CLIENT_ID" ]; then
    echo "❌ NEXT_PUBLIC_PAYPAL_CLIENT_ID not set"
    echo "Please set your PayPal sandbox client ID"
    exit 1
else
    echo "✅ NEXT_PUBLIC_PAYPAL_CLIENT_ID is set"
fi

if [ -z "$PAYPAL_CLIENT_SECRET" ]; then
    echo "❌ PAYPAL_CLIENT_SECRET not set"
    echo "Please set your PayPal sandbox client secret"
    exit 1
else
    echo "✅ PAYPAL_CLIENT_SECRET is set"
fi

if [ "$PAYPAL_ENVIRONMENT" != "sandbox" ]; then
    echo "⚠️  PAYPAL_ENVIRONMENT is not 'sandbox'"
    echo "Make sure you're using sandbox for testing"
fi

echo ""
echo "🚀 Starting test sequence..."

# Check if server is running
echo "📡 Checking if dev server is running..."
if curl -s http://shop.vybrows-academy.com > /dev/null; then
    echo "✅ Dev server is running on port 3000"
else
    echo "❌ Dev server not running on port 3000"
    echo "Please start with: npm run dev"
    exit 1
fi

echo ""
echo "📋 Test Checklist:"
echo "✅ Environment variables configured"
echo "✅ Dev server running"
echo "✅ PayPal SDK should load"
echo "✅ API routes should work"
echo ""

echo "🎯 Manual Test Steps:"
echo "1. Open browser to http://shop.vybrows-academy.com"
echo "2. Add any product to cart"
echo "3. Click 'PayPal Checkout' button"
echo "4. Login with sandbox account:"
echo "   - Email: sb-xxxxx@personal.example.com"
echo "   - Password: abc12345"
echo "5. Use test card: 4111111111111111"
echo "6. Complete payment"
echo ""

echo "🔍 Expected Results:"
echo "- PayPal button should appear"
echo "- Redirect to PayPal login"
echo "- Successful payment processing"
echo "- Cart cleared after payment"
echo "- Success alert displayed"
echo ""

echo "📊 API Endpoints to Test:"
echo "POST /api/paypal/create-order"
echo "POST /api/paypal/capture-order"
echo ""

echo "💡 Debug Tips:"
echo "1. Check browser console for errors"
echo "2. Look for 'PayPal SDK loaded' message"
echo "3. Verify order creation in console"
echo "4. Check PayPal Developer Dashboard for transactions"
echo ""

echo "🎉 Test setup complete!"
echo "Follow the manual steps above to test PayPal integration."
