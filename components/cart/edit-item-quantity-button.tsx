'use client';

import clsx from 'clsx';
import type { CartItem } from 'lib/types';

export default function EditItemQuantityButton({ item, type, optimisticUpdate }: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: (merchandiseId: string, updateType: 'plus' | 'minus') => void;
}) {
  return (
    <button
      type="button"
      aria-label={type === 'plus' ? 'Increase quantity' : 'Decrease quantity'}
      disabled={!item?.merchandise?.id && !item?.id}
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-full',
        type === 'plus' ? 'bg-[#003324] text-white' : 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white',
        'transition-all hover:scale-105',
        { 'opacity-50 cursor-not-allowed': !item?.merchandise?.id && !item?.id }
      )}
      onClick={() => {
        const merchandiseId = item?.merchandise?.id ?? item?.id;
        if (typeof merchandiseId === 'string' && merchandiseId.length > 0) {
          optimisticUpdate(merchandiseId, type);
        }
      }}
    >
      {type === 'plus' ? '+' : '-'}
    </button>
  );
}
