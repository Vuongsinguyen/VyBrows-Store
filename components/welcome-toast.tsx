'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=2')) {
      toast('🛍️ Welcome to Next.js Commerce!', {
        id: 'welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
            This is VyBrows-Store, a high-performance, SSR ecommerce storefront powered by Next.js and Vercel with local data management.{' '}
            <a
              href="https://vercel.com/templates/next.js/nextjs-commerce"
              className="text-[#003324] hover:underline"
              target="_blank"
            >
              Deploy your own
            </a>
            .
          </>
        )
      });
    }
  }, []);

  return null;
}
