'use client';

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant
} from 'lib/types';
import React, {
  createContext,
  use,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: 'ADD_ITEM';
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string | number): string {
  const n = typeof price === 'number' ? price : Number(price || 0);
  const value = Number.isNaN(n) ? 0 : n;
  return (value * (quantity || 0)).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const currentAmount = Number(item.cost?.totalAmount?.amount ?? 0);
  const singleItemAmount = item.quantity ? currentAmount / item.quantity : currentAmount;
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount);

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        amount: newTotalAmount,
        currencyCode: item.cost?.totalAmount?.currencyCode ?? 'USD'
      }
    }
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const priceVal = variant?.price?.amount ?? (variant as any)?.price ?? 0;
  const currency = variant?.price?.currencyCode ?? 'USD';
  const totalAmount = calculateItemCost(quantity, priceVal);

  return {
    id: existingItem?.id ?? `${product?.id ?? 'prod'}-${variant?.id ?? 'var'}`,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: currency
      }
    },
    merchandise: {
      id: variant?.id ?? existingItem?.merchandise?.id ?? `${product?.id}-default`,
      title: variant?.title ?? product?.title,
      selectedOptions: variant?.selectedOptions ?? [],
      product: {
        id: product?.id ?? existingItem?.merchandise?.product?.id,
        handle: product?.handle ?? existingItem?.merchandise?.product?.handle,
        title: product?.title ?? existingItem?.merchandise?.product?.title,
        featuredImage: product?.featuredImage ?? existingItem?.merchandise?.product?.featuredImage
      }
    }
  } as CartItem;
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalAmount = lines.reduce((sum, item) => {
    const amt = Number(item.cost?.totalAmount?.amount ?? 0);
    return sum + (Number.isNaN(amt) ? 0 : amt);
  }, 0);
  const currencyCode = lines[0]?.cost?.totalAmount?.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

function createEmptyCart(): Cart {
  return {
  id: undefined,
  checkoutUrl: '',
  totalQuantity: 0,
  lines: [],
  items: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();
  const lines = currentCart.lines ?? [];

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = lines
        .map((item) =>
          (item?.merchandise?.id ?? item?.id) === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          items: [],
          totalQuantity: 0,
          cost: {
            subtotalAmount: { amount: '0', currencyCode: 'USD' },
            totalAmount: { amount: '0', currencyCode: 'USD' },
            totalTaxAmount: { amount: '0', currencyCode: 'USD' }
          }
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
        items: updatedLines
      };
    }
    case 'ADD_ITEM': {
      const { variant, product } = action.payload;
      console.log('CartContext: Processing ADD_ITEM action:', { variant, product });

      const matchId = variant?.id ?? `${product?.id}-default`;
      console.log('CartContext: matchId:', matchId);

      const existingItem = lines.find((item) => (item?.merchandise?.id ?? item?.id) === matchId);
      console.log('CartContext: existingItem:', existingItem);

      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );
      console.log('CartContext: updatedItem:', updatedItem);

      const updatedLines = existingItem
        ? lines.map((item) =>
            (item?.merchandise?.id ?? item?.id) === matchId ? updatedItem : item
          )
        : [...lines, updatedItem];

      console.log('CartContext: updatedLines:', updatedLines);

      const newCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
        items: updatedLines
      };

      console.log('CartContext: newCart:', newCart);
      return newCart;
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const initialCart = use(context.cartPromise);
  const [cart, setCart] = useState<Cart>(initialCart || createEmptyCart());

  const updateCartItemCallback = useCallback((merchandiseId: string, updateType: UpdateType) => {
    setCart(currentCart => {
      const lines = currentCart.lines ?? [];
      const updatedLines = lines
        .map((item) =>
          (item?.merchandise?.id ?? item?.id) === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          items: [],
          totalQuantity: 0,
          cost: {
            subtotalAmount: { amount: '0', currencyCode: 'USD' },
            totalAmount: { amount: '0', currencyCode: 'USD' },
            totalTaxAmount: { amount: '0', currencyCode: 'USD' }
          }
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
        items: updatedLines
      };
    });
  }, []);

  const addCartItem = useCallback((variant: ProductVariant, product: Product) => {
    console.log('CartContext: addCartItem called');
    setCart(currentCart => {
      const lines = currentCart.lines ?? [];
      console.log('CartContext: current lines count:', lines.length);

      const matchId = variant?.id ?? `${product?.id}-default`;
      console.log('CartContext: matchId:', matchId);

      const existingItem = lines.find((item) => (item?.merchandise?.id ?? item?.id) === matchId);
      console.log('CartContext: existingItem found:', !!existingItem);

      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );
      console.log('CartContext: updatedItem quantity:', updatedItem.quantity);

      const updatedLines = existingItem
        ? lines.map((item) =>
            (item?.merchandise?.id ?? item?.id) === matchId ? updatedItem : item
          )
        : [...lines, updatedItem];

      console.log('CartContext: updatedLines count:', updatedLines.length);

      const newCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
        items: updatedLines
      };

      console.log('CartContext: newCart totalQuantity:', newCart.totalQuantity);
      return newCart;
    });
  }, []);

  return useMemo(
    () => ({
      cart,
      updateCartItem: updateCartItemCallback,
      addCartItem
    }),
    [cart, updateCartItemCallback, addCartItem]
  );
}
