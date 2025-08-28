import imageFragment from './image';
import seoFragment from './seo';

// Mock product data thay cho productFragment

export const product = {
  id: 'gid://shopify/Product/1',
  handle: 'san-pham-1',
  availableForSale: true,
  title: 'Sản phẩm 1',
  description: 'Mô tả sản phẩm 1',
  descriptionHtml: '<p>Mô tả sản phẩm 1</p>',
  options: [
    { id: 'opt1', name: 'Màu sắc', values: ['Đỏ', 'Xanh'] }
  ],
  priceRange: {
    maxVariantPrice: { amount: '200000', currencyCode: 'VND' },
    minVariantPrice: { amount: '150000', currencyCode: 'VND' }
  },
  variants: {
    edges: [
      {
        node: {
          id: 'v1',
          title: 'Đỏ',
          availableForSale: true,
          selectedOptions: [{ name: 'Màu sắc', value: 'Đỏ' }],
          price: { amount: '200000', currencyCode: 'VND' }
        }
      }
    ]
  },
  featuredImage: {
    url: '/images/product001.png',
    altText: 'Sản phẩm 1',
    width: 600,
    height: 600
  },
  images: {
    edges: [
      {
        node: {
          url: '/images/product001.png',
          altText: 'Sản phẩm 1',
          width: 600,
          height: 600
        }
      }
    ]
  },
  seo: {
    title: 'Sản phẩm 1',
    description: 'SEO mô tả sản phẩm 1'
  },
  tags: ['tag1', 'tag2'],
  updatedAt: '2025-08-28'
};

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
