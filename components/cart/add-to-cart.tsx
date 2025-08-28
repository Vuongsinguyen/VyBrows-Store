'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Product, ProductVariant } from 'lib/types';
import { useEffect } from 'react';
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

  useEffect(() => {
    console.log('SubmitButton: Component mounted, onClick prop:', !!onClick);
  }, [onClick]);

  if (!availableForSale) {
    console.log('SubmitButton: Product not available for sale');
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariant) {
    console.log('SubmitButton: selectedVariant is undefined, button disabled');
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  console.log('SubmitButton: selectedVariant is valid, button enabled');
  return (
    <button
      type="button"
      aria-label="Add to cart"
      onClick={(e) => {
        console.log('SubmitButton: onClick triggered from button click');
        e.preventDefault(); // Ngăn form submit nếu có
        if (onClick) {
          onClick();
        } else {
          console.error('SubmitButton: onClick prop is undefined');
        }
      }}
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

  console.log('AddToCart: Product variants:', variants);
  console.log('AddToCart: Available for sale:', availableForSale);
  console.log('AddToCart: addCartItem function:', addCartItem);

  // Luôn dùng variant đầu tiên làm mặc định
  const defaultVariant = variants?.[0];
  const selectedVariant = defaultVariant;

  console.log('AddToCart: Default variant:', defaultVariant);
  console.log('AddToCart: Selected variant:', selectedVariant);

  useEffect(() => {
    console.log('AddToCart: Component mounted');
  }, []);

  const handleAddToCart = () => {
    console.log('AddToCart: handleAddToCart called');
    if (!selectedVariant) {
      console.log('AddToCart: No selectedVariant, skipping');
      return;
    }
    if (!addCartItem) {
      console.error('AddToCart: addCartItem is undefined');
      return;
    }
    try {
      console.log('AddToCart: Calling addCartItem with:', selectedVariant, product);
      addCartItem(selectedVariant, product);
      console.log('AddToCart: addCartItem called successfully');
    } catch (error) {
      console.error('AddToCart: Error adding to cart', error);
    }
  };

  return (
    <SubmitButton
      availableForSale={availableForSale}
      selectedVariant={selectedVariant}
      onClick={handleAddToCart}
    />
  );
}