// Mock menu data
const menu = [
  { title: 'Trang chủ', url: '/' },
  { title: 'Sản phẩm', url: '/san-pham' },
  { title: 'Liên hệ', url: '/lien-he' }
];

// Hàm lấy menu local
export function getMenu(handle: string) {
  // Có thể lọc theo handle nếu có nhiều menu
  return menu;
}
