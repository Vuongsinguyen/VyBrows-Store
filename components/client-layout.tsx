'use client';

import { CartProvider } from 'components/cart/cart-context';
import { ReactNode, useMemo } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  // Use local empty cart instead of Shopify API
  const cartPromise = useMemo(() => Promise.resolve({
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    items: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  }), []);

  return (
    <CartProvider cartPromise={cartPromise}>
      {children}
    </CartProvider>
  );
}
