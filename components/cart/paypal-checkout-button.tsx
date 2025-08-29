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
  const { cart, clearCart } = useCart();

  // Get the first item from cart for PayPal order
  const firstItem = cart.items[0];

  useEffect(() => {
    // Only load PayPal SDK if we have items in cart
    if (!firstItem || disabled) return;

    // Load PayPal JavaScript SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButton();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test'}&currency=USD&components=buttons`;
      script.async = true;
      script.onload = () => renderPayPalButton();
      script.onerror = () => setError('Failed to load PayPal SDK');
      document.head.appendChild(script);
    };

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalRef.current) return;

      // Clear any existing buttons
      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        // Step 1: Create PayPal order on button click
        createOrder: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            setError(null);

            // Prepare order data from cart
            const orderData = {
              item: {
                title: firstItem.merchandise?.title || 'Product',
                quantity: firstItem.quantity,
                price: firstItem.cost?.totalAmount?.amount || '0',
                currency: firstItem.cost?.totalAmount?.currencyCode || 'USD'
              },
              total: cart.cost?.totalAmount?.amount || '0',
              currency: cart.cost?.totalAmount?.currencyCode || 'USD'
            };

            console.log('📦 Creating PayPal order with data:', orderData);

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
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript();
  }, [firstItem, cart, disabled, clearCart, onSuccess, onError]);

  // Don't render if cart is empty or disabled
  if (!firstItem || disabled) {
    return null;
  }

  return (
    <div className={`paypal-checkout-container ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600 text-sm">Processing payment...</p>
        </div>
      )}

      <div ref={paypalRef} className="paypal-button-container" />

      <div className="mt-4 text-xs text-gray-500">
        <p>💳 Secure payment powered by PayPal</p>
        <p>🛒 Processing first item: {firstItem.merchandise?.title}</p>
        <p>💰 Amount: ${firstItem.cost?.totalAmount?.amount} {firstItem.cost?.totalAmount?.currencyCode}</p>
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
