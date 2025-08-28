import { getCart as getCartLocal } from '../index';

// Local wrapper for getting the cart. Kept for compatibility with code
// that imports this module. Returns the app's local cart stored via
// cookie logic in `lib/shopify/index.ts`.
export async function getCart(cartId?: string) {
  // cartId is ignored for local single-cart implementation
  return await getCartLocal();
}

// Placeholder query string kept for any consumers that expect the
// symbol, but it's not used for local data operations.
export const getCartQuery = `# local cart - no GraphQL`;
