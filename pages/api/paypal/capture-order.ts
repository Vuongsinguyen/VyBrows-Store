import type { NextApiRequest, NextApiResponse } from 'next';

// PayPal capture request data interface
interface PayPalCaptureRequest {
  orderId: string;
}

// PayPal capture response interfaces
interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        create_time: string;
      }>;
    };
  }>;
}

interface PayPalError {
  error: string;
  details?: any;
}

/**
 * Serverless function to capture a PayPal order
 *
 * This function:
 * 1. Validates the order ID from the client
 * 2. Captures the PayPal payment using the REST API
 * 3. Returns transaction details for confirmation
 *
 * Environment Variables Required:
 * - PAYPAL_CLIENT_ID: Your PayPal app client ID
 * - PAYPAL_CLIENT_SECRET: ECqeogQXxMCfohOT1uBhuHutZ1MpAh9EYUzO9MzxKlRHEbkdYSoK1Y1ZZkNAZD95EGaQtaCHodge3PfD
 * - PAYPAL_ENVIRONMENT: 'sandbox' or 'production' (default: sandbox)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PayPalCaptureResponse | PayPalError>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Validate and extract request data
    const { orderId }: PayPalCaptureRequest = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'Missing required field: orderId'
      });
    }

    console.log('💰 Capturing PayPal order:', orderId);

    // Step 2: Validate environment variables
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal credentials');
      return res.status(500).json({
        error: 'PayPal configuration error. Please check server environment variables.'
      });
    }

    // Step 3: Get PayPal access token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch(
      environment === 'production'
        ? 'https://api.paypal.com/v1/oauth2/token'
        : 'https://api.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }
    );

    if (!tokenResponse.ok) {
      console.error('❌ Failed to get PayPal access token');
      return res.status(500).json({
        error: 'Failed to authenticate with PayPal'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 4: Capture the PayPal order
    const captureResponse = await fetch(
      environment === 'production'
        ? `https://api.paypal.com/v2/checkout/orders/${orderId}/capture`
        : `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('❌ PayPal capture failed:', errorData);

      // Handle specific PayPal error cases
      if (errorData.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
        return res.status(400).json({
          error: 'Order has already been captured'
        });
      }

      if (errorData.details?.[0]?.issue === 'ORDER_NOT_APPROVED') {
        return res.status(400).json({
          error: 'Order was not approved by the customer'
        });
      }

      return res.status(500).json({
        error: 'Failed to capture PayPal payment',
        details: errorData
      });
    }

    const captureData: PayPalCaptureResponse = await captureResponse.json();
    console.log('✅ PayPal payment captured successfully:', captureData.id);

    // Step 5: Validate capture response
    const capture = captureData.purchase_units[0]?.payments?.captures[0];
    if (!capture) {
      console.error('❌ Invalid capture response structure');
      return res.status(500).json({
        error: 'Invalid capture response from PayPal'
      });
    }

    // Step 6: Return capture details to client
    return res.status(200).json(captureData);

  } catch (error) {
    console.error('❌ Unexpected error capturing PayPal order:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
