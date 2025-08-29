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

// Security: Input validation and sanitization
const validateAndSanitizeOrderData = (data: any): PayPalOrderData => {
  // Check required fields
  if (!data.item?.title || !data.total || !data.currency) {
    throw new Error('Missing required fields: item.title, total, currency');
  }

  // Validate and sanitize item title (prevent XSS)
  const sanitizedTitle = data.item.title
    .toString()
    .substring(0, 127) // PayPal limit
    .replace(/[<>\"'&]/g, ''); // Remove potentially dangerous characters

  // Validate quantity
  const quantity = Math.max(1, parseInt(data.item.quantity) || 1);

  // Validate and format price
  const price = parseFloat(data.total);
  if (isNaN(price) || price <= 0 || price > 10000) { // Reasonable limits
    throw new Error('Invalid price amount');
  }

  // Validate currency
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const currency = data.currency.toUpperCase();
  if (!validCurrencies.includes(currency)) {
    throw new Error('Unsupported currency');
  }

  return {
    item: {
      title: sanitizedTitle,
      quantity: quantity,
      price: price.toFixed(2),
      currency: currency
    },
    total: price.toFixed(2),
    currency: currency
  };
};

// Security: Safe logging function
const safeLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  } else {
    // Production: only log non-sensitive info
    console.log(message);
  }
};

// Security: Validate environment variables at startup
const validateEnvironment = () => {
  const required = ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate PayPal Client ID format
  if (!process.env.PAYPAL_CLIENT_ID?.startsWith('A')) {
    throw new Error('Invalid PayPal Client ID format');
  }

  // Validate PayPal Client Secret format
  if (!process.env.PAYPAL_CLIENT_SECRET?.startsWith('E')) {
    throw new Error('Invalid PayPal Client Secret format');
  }
};

// Security: Get site URL dynamically with request context
const getSiteUrl = (req?: NextApiRequest): string => {
  // Priority 1: Environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Priority 2: Extract from request headers (for production)
  if (req?.headers?.host) {
    const host = req.headers.host;
    // Remove port if present
    const domain = host.split(':')[0];
    // Skip localhost and common development domains
    if (domain && !domain.includes('localhost') && !domain.includes('127.0.0.1')) {
      return domain;
    }
  }

  // Priority 3: Fallback to localhost for development
  if (process.env.NODE_ENV === 'development') {
    return 'localhost:3000';
  }

  // Priority 4: Default production domain
  return 'shop.vybrows-academy.com';
};

// Initialize environment validation
validateEnvironment();

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
    // Step 1: Validate and sanitize request data
    const orderData = validateAndSanitizeOrderData(req.body);

    safeLog('📦 Creating PayPal order for:', {
      title: orderData.item.title,
      quantity: orderData.item.quantity,
      total: orderData.total,
      currency: orderData.currency
    });

    // Step 2: Validate environment variables (already done at startup)
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

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

    // Step 4: Create PayPal order
    const paypalOrderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: orderData.currency,
            value: orderData.total,
            breakdown: {
              item_total: {
                currency_code: orderData.currency,
                value: orderData.total
              }
            }
          },
          items: [
            {
              name: orderData.item.title.substring(0, 127), // PayPal limit
              quantity: orderData.item.quantity.toString(),
              unit_amount: {
                currency_code: orderData.currency,
                value: orderData.item.price
              }
            }
          ]
        }
      ],
      application_context: {
        return_url: `https://${getSiteUrl(req)}/checkout/success`,
        cancel_url: `https://${getSiteUrl(req)}/checkout/cancel`,
        user_action: 'PAY_NOW',
        brand_name: 'VyBrows Store'
      }
    };

    safeLog('📋 PayPal order payload:', {
      intent: paypalOrderData.intent,
      currency: paypalOrderData.purchase_units[0]?.amount.currency_code,
      total: paypalOrderData.purchase_units[0]?.amount.value,
      itemCount: paypalOrderData.purchase_units[0]?.items.length
    });

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
        body: JSON.stringify(paypalOrderData),
      }
    );

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      safeLog('❌ PayPal order creation failed:', {
        status: orderResponse.status,
        error: errorData
      });
      return res.status(500).json({
        error: 'Failed to create PayPal order',
        details: errorData
      });
    }

    const orderResult: PayPalOrderResponse = await orderResponse.json();
    safeLog('✅ PayPal order created successfully:', {
      id: orderResult.id,
      status: orderResult.status
    });

    // Step 5: Return order details to client
    return res.status(200).json(orderResult);

  } catch (error) {
    safeLog('❌ Unexpected error creating PayPal order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
