'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useActionState } from 'react';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  // defensive: merchandise may be undefined, fall back to item.id
  const merchandiseId = item?.merchandise?.id ?? item?.id;
  const removeItemAction = merchandiseId ? formAction.bind(null, merchandiseId) : undefined;

  return (
    <>
      <form
        action={async () => {
          if (!merchandiseId || !removeItemAction) return;
          optimisticUpdate(merchandiseId, 'delete');
          removeItemAction();
        }}
      >
        <button
          type="submit"
          aria-label="Remove cart item"
          disabled={!merchandiseId}
          className={clsx('flex h-[24px] w-[24px] items-center justify-center rounded-full', {
            'bg-neutral-500': merchandiseId,
            'bg-neutral-300 cursor-not-allowed opacity-60': !merchandiseId
          })}
        >
          <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
        </button>
      </form>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </>
  );
}
