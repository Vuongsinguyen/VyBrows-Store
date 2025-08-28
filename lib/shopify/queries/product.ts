import product from '../fragments/product';

// Hàm lấy một sản phẩm theo handle
export function getProduct(handle: string) {
  // Có thể lọc theo handle nếu có nhiều sản phẩm
  return product;
}

// Hàm lấy tất cả sản phẩm
export function getProducts() {
  return [product];
}

// Hàm lấy sản phẩm gợi ý (recommendations)
export function getProductRecommendations(productId: string) {
  // Có thể lọc theo productId nếu có nhiều sản phẩm
  return [product];
}
