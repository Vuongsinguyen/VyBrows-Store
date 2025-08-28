import product from '../fragments/product';
import seo from '../fragments/seo';

// Mock collection data
const collection = {
  handle: 'collection-1',
  title: 'Bộ sưu tập 1',
  description: 'Mô tả bộ sưu tập 1',
  seo,
  updatedAt: '2025-08-28',
  products: [product]
};

// Hàm lấy một collection theo handle
export function getCollection(handle: string) {
  // Có thể lọc theo handle nếu có nhiều collection
  return collection;
}

// Hàm lấy tất cả collections
export function getCollections() {
  // Return collection objects compatible with the UI (title, path, updatedAt)
  return [
    {
      title: collection.title,
      path: `/search?collection=${encodeURIComponent(collection.handle)}`,
      updatedAt: collection.updatedAt
    }
  ];
}

// Hàm lấy sản phẩm của một collection
export function getCollectionProducts(handle: string) {
  // Có thể lọc theo handle nếu có nhiều collection
  return [product];
}
