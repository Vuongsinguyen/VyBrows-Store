'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { CartItem } from 'lib/types';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, updateType: 'delete') => void;
}) {
  // defensive: merchandise may be undefined, fall back to item.id
  const merchandiseId = item?.merchandise?.id ?? item?.id;

  const handleClick = () => {
    if (!merchandiseId) return;
    optimisticUpdate(merchandiseId, 'delete');
  };

  return (
    <button
      type="button"
      aria-label="Remove cart item"
      disabled={!merchandiseId}
      onClick={handleClick}
      className={clsx('flex h-[24px] w-[24px] items-center justify-center rounded-full', {
        'bg-neutral-500': merchandiseId,
        'bg-neutral-300 cursor-not-allowed opacity-60': !merchandiseId
      })}
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
