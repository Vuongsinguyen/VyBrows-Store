'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { startTransition, useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  onClick
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  onClick?: () => void;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
          Add To Cart
        </button>
    );
  }

  return (
      <button
        type="submit"
        aria-label="Add to cart"
        onClick={onClick}
        className={clsx(buttonClasses, {
          'hover:opacity-90': true
        })}
      >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    // Provide the bound form action directly so Next can invoke the server action
    // The optimistic update is triggered via the button's onClick handler.
    <form action={formAction}>
      {/* send selectedVariantId as form field so server action receives it */}
      <input type="hidden" name="selectedVariantId" value={selectedVariantId || ''} />
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        onClick={() => startTransition(() => addCartItem(finalVariant, product))}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
