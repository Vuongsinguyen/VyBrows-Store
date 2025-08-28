import { default as cart, default as cartFragment } from '../fragments/cart';

// Hàm lấy dữ liệu giỏ hàng local
export function getCart(cartId: string) {
  // Có thể lọc theo cartId nếu có nhiều giỏ hàng
  return cart;
}

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
