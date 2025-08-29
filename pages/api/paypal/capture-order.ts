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

// Security: Input validation and sanitization
function validateAndSanitizeCaptureData(data: any): PayPalCaptureRequest {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request data');
  }

  const { orderId } = data;

  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Missing or invalid orderId');
  }

  // Sanitize orderId - PayPal order IDs are alphanumeric with dashes
  const sanitizedOrderId = orderId.trim().replace(/[^a-zA-Z0-9\-]/g, '');

  if (sanitizedOrderId.length < 10 || sanitizedOrderId.length > 50) {
    throw new Error('Invalid orderId format');
  }

  return { orderId: sanitizedOrderId };
}

// Security: Safe logging function
function safeLog(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  } else {
    // In production, only log essential info without sensitive data
    console.log(message);
  }
}

// Security: Environment validation
function validateEnvironment(): { clientId: string; clientSecret: string; environment: string } {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  // Validate environment
  if (!['sandbox', 'production'].includes(environment)) {
    throw new Error('Invalid PayPal environment');
  }

  return { clientId, clientSecret, environment };
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
 * - PAYPAL_CLIENT_SECRET: Your PayPal app client secret
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
    // Step 1: Validate and sanitize request data
    const captureData = validateAndSanitizeCaptureData(req.body);

    safeLog('💰 Capturing PayPal order:', captureData.orderId);

    // Step 2: Validate environment variables (already done at startup)
    const { clientId, clientSecret, environment } = validateEnvironment();

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
      safeLog('❌ Failed to get PayPal access token');
      return res.status(500).json({
        error: 'Failed to authenticate with PayPal'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 4: Capture the PayPal order
    const captureResponse = await fetch(
      environment === 'production'
        ? `https://api.paypal.com/v2/checkout/orders/${captureData.orderId}/capture`
        : `https://api.sandbox.paypal.com/v2/checkout/orders/${captureData.orderId}/capture`,
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
      safeLog('❌ PayPal capture failed:', {
        status: captureResponse.status,
        error: errorData
      });

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

    const captureResult: PayPalCaptureResponse = await captureResponse.json();
    safeLog('✅ PayPal payment captured successfully:', {
      id: captureResult.id,
      status: captureResult.status
    });

    // Step 5: Validate capture response
    const capture = captureResult.purchase_units[0]?.payments?.captures[0];
    if (!capture) {
      safeLog('❌ Invalid capture response structure');
      return res.status(500).json({
        error: 'Invalid capture response from PayPal'
      });
    }

    // Step 6: Return capture details to client
    return res.status(200).json(captureResult);

  } catch (error) {
    safeLog('❌ Unexpected error capturing PayPal order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
