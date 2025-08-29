// Local type definitions for VyBrows-Store
// These types are designed for local data implementation and can be adapted for external providers

export type Image = {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: {
    amount: string;
    currencyCode: string;
  };
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: number;
  images: Image[];
  tags: string[];
  featuredImage: Image;
  seo?: {
    title?: string;
    description?: string;
  };
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  options: ProductOption[];
  variants: ProductVariant[];
};

export type Menu = {
  title: string;
  path: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  cost?: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: Image;
    };
  };
};

export type Cart = {
  id?: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  items: CartItem[];
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};
