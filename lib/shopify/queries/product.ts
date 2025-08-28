import {
  getProduct as getProductLocal,
  getProductRecommendations as getProductRecommendationsLocal,
  getProducts as getProductsLocal
} from '../index';

// Forwarding wrappers to local implementations that read `data/products.json`.
export function getProduct(handle: string) {
  return getProductLocal(handle);
}

export function getProducts(options?: any) {
  return getProductsLocal(options);
}

export function getProductRecommendations(productId: string) {
  return getProductRecommendationsLocal(productId);
}
