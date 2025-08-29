import type { NextApiRequest, NextApiResponse } from 'next';

// PayPal order creation data interface
interface PayPalOrderData {
  item: {
    title: string;
    quantity: number;
    price: string;
    currency: string;
  };
  total: string;
  currency: string;
}

// PayPal API response interfaces
interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalError {
  error: string;
  details?: any;
}

/**
 * Serverless function to create a PayPal order
 *
 * This function:
 * 1. Validates environment variables (PayPal client ID and secret)
 * 2. Creates a PayPal order using the REST API
 * 3. Returns the order ID for client-side approval
 *
 * Environment Variables Required:
 * - PAYPAL_CLIENT_ID: Your PayPal app client ID
 * - PAYPAL_CLIENT_SECRET: Your PayPal app client secret
 * - PAYPAL_ENVIRONMENT: 'sandbox' or 'production' (default: sandbox)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PayPalOrderResponse | PayPalError>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Validate and extract request data
    const { item, total, currency }: PayPalOrderData = req.body;

    if (!item || !total || !currency) {
      return res.status(400).json({
        error: 'Missing required fields: item, total, currency'
      });
    }

    console.log('📦 Creating PayPal order for:', { item, total, currency });

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

    // Step 4: Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
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
          items: [
            {
              name: item.title.substring(0, 127), // PayPal limit
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: currency,
                value: item.price
              }
            }
          ]
        }
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
        user_action: 'PAY_NOW',
        brand_name: 'VyBrows Store'
      }
    };

    console.log('📋 PayPal order payload:', JSON.stringify(orderData, null, 2));

    const orderResponse = await fetch(
      environment === 'production'
        ? 'https://api.paypal.com/v2/checkout/orders'
        : 'https://api.sandbox.paypal.com/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('❌ PayPal order creation failed:', errorData);
      return res.status(500).json({
        error: 'Failed to create PayPal order',
        details: errorData
      });
    }

    const order: PayPalOrderResponse = await orderResponse.json();
    console.log('✅ PayPal order created successfully:', order.id);

    // Step 5: Return order details to client
    return res.status(200).json(order);

  } catch (error) {
    console.error('❌ Unexpected error creating PayPal order:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
