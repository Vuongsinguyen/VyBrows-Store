'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariant,
  onClick
}: {
  availableForSale: boolean;
  selectedVariant?: ProductVariant;
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

  if (!selectedVariant) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Add to cart"
      onClick={onClick}
      className={clsx(buttonClasses, 'hover:opacity-90')}
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

  // Luôn dùng variant đầu tiên làm mặc định
  const defaultVariant = variants?.[0];
  const selectedVariant = defaultVariant;

  return (
    <SubmitButton
      availableForSale={availableForSale}
      selectedVariant={selectedVariant}
      onClick={() => {
        if (!selectedVariant) return;
        try {
          addCartItem(selectedVariant, product);
        } catch (error) {
          console.error('AddToCart: Error adding to cart', error);
        }
      }}
    />
  );
}