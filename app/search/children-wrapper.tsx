'use client';

import { useSearchParams } from 'next/navigation';
import { Fragment } from 'react';

// Ensure children are re-rendered when the search query changes
export default function ChildrenWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  // Safely handle searchParams and provide fallback for key
  const searchQuery = searchParams?.get('q') || '';
  const key = searchQuery || 'default-search';

  return <Fragment key={key}>{children}</Fragment>;
}
