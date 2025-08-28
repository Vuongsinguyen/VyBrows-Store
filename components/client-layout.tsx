'use client';

import { CartProvider } from 'components/cart/cart-context';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
