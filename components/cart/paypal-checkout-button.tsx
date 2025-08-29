'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from './cart-context';

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

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
      }>;
    };
  }>;
}

interface PayPalCheckoutButtonProps {
  onSuccess?: (transactionId: string, amount: string, status: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function PayPalCheckoutButton({
  onSuccess,
  onError,
  disabled = false,
  className = ''
}: PayPalCheckoutButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const { cart, clearCart } = useCart();

  // Get the first item from cart for PayPal order
  const firstItem = cart.items[0];

  // Get PayPal client ID and environment from environment variables
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const paypalEnvironment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox';

  useEffect(() => {
    // Only load PayPal SDK if we have items in cart and client ID is available
    if (!firstItem || disabled || !paypalClientId) {
      if (!paypalClientId) {
        setError('PayPal client ID not configured. Please check your environment variables.');
      }
      return;
    }

    // Load PayPal JavaScript SDK with proper error handling
    loadPayPalSDK();

    // Cleanup function
    return () => {
      // Clean up any existing PayPal buttons
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [firstItem, disabled, paypalClientId, paypalEnvironment]);

  /**
   * Load PayPal SDK with proper error handling and race condition prevention
   */
  const loadPayPalSDK = () => {
    // Check if SDK is already loaded
    if (window.paypal) {
      console.log('✅ PayPal SDK already loaded');
      setSdkLoaded(true);
      renderPayPalButton();
      return;
    }

    // Check if SDK is already being loaded (prevent duplicate scripts)
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      console.log('⏳ PayPal SDK script already exists, waiting for load...');
      // Wait for the existing script to load
      existingScript.addEventListener('load', () => {
        setSdkLoaded(true);
        renderPayPalButton();
      });
      existingScript.addEventListener('error', () => {
        setError('Failed to load PayPal SDK');
      });
      return;
    }

    console.log('📦 Loading PayPal SDK...');

    // Create and load the PayPal SDK script
    const paypalEndpoint = paypalEnvironment === 'production' 
      ? 'https://www.paypal.com/sdk/js'
      : 'https://www.sandbox.paypal.com/sdk/js';
    const script = document.createElement('script');
    script.src = `${paypalEndpoint}?client-id=${paypalClientId}&currency=USD&components=buttons&enable-funding=venmo`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    // Success handler
    script.onload = () => {
      console.log('✅ PayPal SDK loaded successfully');
      setSdkLoaded(true);
      setError(null);
      renderPayPalButton();
    };

    // Error handler
    script.onerror = (event) => {
      console.error('❌ Failed to load PayPal SDK:', event);
      setError('Failed to load PayPal SDK. Please check your internet connection and try again.');
      setSdkLoaded(false);
    };

    // Add script to document head
    document.head.appendChild(script);
  };

  /**
   * Render PayPal button with proper error handling
   */
  const renderPayPalButton = () => {
    if (!window.paypal || !paypalRef.current) {
      console.error('❌ PayPal SDK or container not available');
      setError('PayPal SDK not available');
      return;
    }

    try {
      console.log('🎨 Rendering PayPal button...');

      // Clear any existing buttons
      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        // Step 1: Create PayPal order on button click
        createOrder: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            setError(null);

            console.log('📦 Creating PayPal order...');

            // Prepare order data from cart
            const orderData = {
              item: {
                title: firstItem?.merchandise?.title || 'Product',
                quantity: firstItem?.quantity || 1,
                price: firstItem?.cost?.totalAmount?.amount || '0',
                currency: firstItem?.cost?.totalAmount?.currencyCode || 'USD'
              },
              total: cart.cost?.totalAmount?.amount || '0',
              currency: cart.cost?.totalAmount?.currencyCode || 'USD'
            };

            console.log('� Order data:', orderData);

            // Call our serverless function to create PayPal order
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData)
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create PayPal order');
            }

            const order: PayPalOrderResponse = await response.json();
            console.log('✅ PayPal order created:', order.id);

            return order.id;
          } catch (error) {
            console.error('❌ Error creating PayPal order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
            setError(errorMessage);
            onError?.(errorMessage);
            throw error;
          } finally {
            setIsLoading(false);
          }
        },

        // Step 2: Handle successful payment approval
        onApprove: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            console.log('💰 Payment approved, capturing order:', data.orderID);

            // Call our serverless function to capture the payment
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: data.orderID
              })
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to capture payment');
            }

            const captureData: PayPalCaptureResponse = await response.json();
            console.log('✅ Payment captured successfully:', captureData);

            // Extract transaction details
            const transactionId = captureData.purchase_units[0]?.payments?.captures[0]?.id;
            const amount = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value;
            const status = captureData.status;

            if (transactionId && amount) {
              // Clear the cart after successful payment
              clearCart();

              // Call success callback
              onSuccess?.(transactionId, amount, status);

              // Show success message
              alert(`🎉 Payment Successful!\n\nTransaction ID: ${transactionId}\nAmount: $${amount}\nStatus: ${status}`);
            } else {
              throw new Error('Invalid capture response');
            }
          } catch (error) {
            console.error('❌ Error capturing payment:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to capture payment';
            setError(errorMessage);
            onError?.(errorMessage);
          } finally {
            setIsLoading(false);
          }
        },

        // Handle payment cancellation
        onCancel: (data: any) => {
          console.log('❌ Payment cancelled by user');
          setError('Payment was cancelled');
        },

        // Handle payment errors
        onError: (err: any) => {
          console.error('❌ PayPal error:', err);
          const errorMessage = 'Payment failed. Please try again.';
          setError(errorMessage);
          onError?.(errorMessage);
        },

        // Styling options
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }
      }).render(paypalRef.current);

      console.log('✅ PayPal button rendered successfully');

    } catch (error) {
      console.error('❌ Error rendering PayPal button:', error);
      setError('Failed to render PayPal button');
    }
  };

  // Don't render if cart is empty, disabled, or client ID is missing
  if (!firstItem || disabled || !paypalClientId) {
    return null;
  }

  return (
    <div className={`paypal-checkout-container ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600 text-sm">Processing payment...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadPayPalSDK();
            }}
            className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* SDK Loading state */}
      {!sdkLoaded && !error && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-600 text-sm">Loading PayPal...</p>
        </div>
      )}

      {/* PayPal button container */}
      <div ref={paypalRef} className="paypal-button-container min-h-[150px]" />

      {/* Information */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>💳 Secure payment powered by PayPal</p>
        <p>🛒 Processing first item: {firstItem?.merchandise?.title}</p>
        <p>💰 Amount: ${firstItem?.cost?.totalAmount?.amount} {firstItem?.cost?.totalAmount?.currencyCode}</p>
        {paypalClientId && (
          <p className="text-green-600">✅ PayPal Client ID configured</p>
        )}
      </div>
    </div>
  );
}

// TypeScript declaration for PayPal global
declare global {
  interface Window {
    paypal?: any;
  }
}
