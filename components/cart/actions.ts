'use server';

import { TAGS } from 'lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(prevStateOrFormData: any, selectedVariantIdMaybe?: string) {
  // Support being invoked either as (prevState, selectedVariantId)
  // or as a form action where Next passes a FormData object.
  let selectedVariantId: string | undefined;

  // Detect FormData (server action when used as <form action={addItem}> passes FormData)
  if (typeof (globalThis as any).FormData !== 'undefined' && prevStateOrFormData instanceof (globalThis as any).FormData) {
    const fd = prevStateOrFormData as FormData;
    const v = fd.get('selectedVariantId');
    selectedVariantId = typeof v === 'string' ? v : undefined;
  } else if (prevStateOrFormData && typeof prevStateOrFormData.get === 'function') {
    // Fallback for environments where FormData global isn't available
    const v = prevStateOrFormData.get('selectedVariantId');
    selectedVariantId = typeof v === 'string' ? v : undefined;
  } else {
    selectedVariantId = selectedVariantIdMaybe;
  }

  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

  const lines = cart.lines ?? [];
  const lineItem = lines.find((line) => (line.merchandise?.id ?? line.id) === merchandiseId);

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

  const lines = cart.lines ?? [];
  const lineItem = lines.find((line) => (line.merchandise?.id ?? line.id) === merchandiseId);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  if (!cart) return;

  // If a checkout URL exists on the cart use it, otherwise fall back
  // to a local, in-repo checkout page so we never call out to Shopify.
  if (cart.checkoutUrl) {
    redirect(cart.checkoutUrl);
  } else {
    redirect('/checkout');
  }
}

export async function createCartAndSetCookie() {
  let cart = await createCart();

  // Ensure basic cart shape and id for local usage
  if (!cart.id) cart.id = `local-${Date.now()}`;
  if (!cart.items) cart.items = [];
  if (!cart.lines) cart.lines = [];

  const cookieStore = await cookies();
  // Persist the whole cart under the 'cart' cookie so getCart() can read it
  cookieStore.set('cart', JSON.stringify(cart));
  return cart;
}
