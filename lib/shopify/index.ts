import fs from 'fs'
import { cookies } from 'next/headers'
import path from 'path'
import { Cart, Menu, Product } from './types'

// đọc sản phẩm từ file JSON
function loadProducts(): Product[] {
  const filePath = path.join(process.cwd(), 'data/products.json')
  const file = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(file)
}

// ---------- CART ----------
export async function getCart(): Promise<Cart> {
  const cartCookie = (await cookies()).get('cart')?.value
  if (!cartCookie) return { items: [] }
  return JSON.parse(cartCookie)
}

export async function createCart(): Promise<Cart> {
  return { items: [] }
}

export async function addToCart(
  items: { productId: string; quantity: number }[]
): Promise<Cart> {
  const cart = await getCart()
  for (const item of items) {
    const existing = cart.items.find((i) => i.productId === item.productId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.items.push(item)
    }
  }
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  return cart
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const cart = await getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  return cart
}

export async function updateCart(
  items: { productId: string; quantity: number }[]
): Promise<Cart> {
  const cart = await getCart()
  for (const item of items) {
    const existing = cart.items.find((i) => i.productId === item.productId)
    if (existing) {
      existing.quantity = item.quantity
    }
  }
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  return cart
}

// ---------- PRODUCTS ----------
export async function getProducts(options?: {
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  let products = loadProducts();

  // Filter by search query
  if (options?.query) {
    const query = options.query.toLowerCase();
    products = products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Sort products
  if (options?.sortKey) {
    products.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (options.sortKey) {
        case 'TITLE':
        case 'RELEVANCE':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'PRICE':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'CREATED_AT':
        case 'BEST_SELLING':
          // For demo, sort by id (newer products have higher id)
          aValue = parseInt(a.id);
          bValue = parseInt(b.id);
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (options.reverse) {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  return products;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const products = loadProducts()
  return products.find((p) => p.handle === handle)
}

// ---------- COLLECTIONS (tags) ----------
export async function getCollections(): Promise<string[]> {
  const products = loadProducts()
  const tags = new Set<string>()
  products.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
  return Array.from(tags)
}

export async function getCollectionProducts(tag: string): Promise<Product[]> {
  const products = loadProducts()
  return products.filter((p) => p.tags?.includes(tag))
}

export async function getPages(): Promise<any[]> {
  // Return local pages data
  return [
    { id: '1', title: 'About', handle: 'about', body: '<p>About our store</p>', bodySummary: 'About our store', seo: { title: 'About', description: 'About our store' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: 'Contact', handle: 'contact', body: '<p>Contact us</p>', bodySummary: 'Contact us', seo: { title: 'Contact', description: 'Contact us' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]
}

export async function getPage(handle: string): Promise<any> {
  const pages = await getPages()
  return pages.find(p => p.handle === handle) || null
}

export async function getMenu(handle?: string): Promise<Menu[]> {
  // Return local menu data
  return [
    { title: 'All', path: '/search' },
    { title: 'Category', path: '/search' }
  ]
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const products = loadProducts()
  const currentProduct = products.find(p => p.id === productId)
  
  if (!currentProduct || !currentProduct.tags) {
    return products.slice(0, 3) // fallback to first 3 products
  }
  
  // Find products with similar tags
  const recommendations = products.filter(p => 
    p.id !== productId && 
    p.tags?.some(tag => currentProduct.tags?.includes(tag))
  )
  
  return recommendations.length >= 3 ? recommendations.slice(0, 3) : products.slice(0, 3)
}