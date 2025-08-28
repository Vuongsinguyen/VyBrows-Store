import seo from '../fragments/seo';

// Mock page data
const page = {
  id: 'page-1',
  title: 'Giới thiệu',
  handle: 'gioi-thieu',
  body: 'Nội dung trang giới thiệu',
  bodySummary: 'Tóm tắt trang giới thiệu',
  seo,
  createdAt: '2025-08-01',
  updatedAt: '2025-08-28'
};

// Hàm lấy một page theo handle
export function getPage(handle: string) {
  // Có thể lọc theo handle nếu có nhiều page
  return page;
}

// Hàm lấy tất cả pages
export function getPages() {
  return [page];
}
