import fs from 'fs'
import { cookies } from 'next/headers'
import path from 'path'
import { Cart, Menu, Product } from './types'

// đọc sản phẩm từ file JSON
export function loadProducts(): Product[] {
  const filePath = path.join(process.cwd(), 'data/products.json')
  const file = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(file)
}

// ---------- CART ----------
export async function getCart(): Promise<Cart> {
  const cartCookie = (await cookies()).get('cart')?.value
  if (!cartCookie) return { lines: [], items: [] }

  const cartData = JSON.parse(cartCookie)

  // Ensure both lines and items are available for compatibility
  const items = cartData.items || cartData.lines || []
  const lines = cartData.lines || cartData.items || []

  return {
    ...cartData,
    lines: lines,
    items: items,
    totalQuantity: cartData.totalQuantity || items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    cost: cartData.cost || {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  }
}

export async function createCart(): Promise<Cart> {
  return { items: [] }
}

export async function addToCart(
  items: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cart = await getCart()
  const products = loadProducts()

  // Ensure cart has items and lines arrays
  if (!cart.items) cart.items = []
  if (!cart.lines) cart.lines = []

  for (const item of items) {
    const existingIndex = cart.items.findIndex((i) => i.merchandise?.id === item.merchandiseId)

    if (existingIndex >= 0) {
      // Update existing item
      const existingItem = cart.items[existingIndex]
      const existingLine = cart.lines[existingIndex]

      if (existingItem) {
        existingItem.quantity += item.quantity
      }
      if (existingLine) {
        existingLine.quantity += item.quantity
      }

      // Update cost if it exists
      const product = products.find(p => p.id === item.merchandiseId.split('-')[0])
      if (product && existingItem?.cost && existingLine?.cost) {
        const totalAmount = (parseFloat(product.price.toString()) * (existingItem.quantity || item.quantity)).toString()
        existingItem.cost.totalAmount.amount = totalAmount
        existingLine.cost.totalAmount.amount = totalAmount
      }
    } else {
      // Create new cart item with full structure
      const product = products.find(p => p.id === item.merchandiseId.split('-')[0])
      if (product) {
        const totalAmount = (parseFloat(product.price.toString()) * item.quantity).toString()
        const variant = product.variants?.find(v => v.id === item.merchandiseId) || product.variants?.[0]

        const newItem = {
          id: `${product.id}-${Date.now()}`, // Generate unique ID for cart item
          productId: item.merchandiseId,
          quantity: item.quantity,
          cost: {
            totalAmount: {
              amount: totalAmount,
              currencyCode: 'USD'
            }
          },
          merchandise: {
            id: item.merchandiseId,
            title: variant?.title || product.title,
            selectedOptions: variant?.selectedOptions || [],
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage || { url: '', altText: '', width: 0, height: 0 }
            }
          }
        }

        cart.items.push(newItem)
        cart.lines.push(newItem)
      }
    }
  }

  // Update totals
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.cost ? parseFloat(item.cost.totalAmount.amount) : 0)
  }, 0)

  cart.totalQuantity = totalQuantity
  cart.cost = {
    subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalTaxAmount: { amount: '0', currencyCode: 'USD' }
  }

  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  return cart
}

export async function removeFromCart(lineItemIds: string[]): Promise<Cart> {
  const cart = await getCart()

  // Ensure cart has items and lines arrays
  if (!cart.items) cart.items = []
  if (!cart.lines) cart.lines = []

  // For local implementation, we'll remove items by merchandise ID
  for (const lineItemId of lineItemIds) {
    cart.items = cart.items.filter((i) => i.merchandise?.id !== lineItemId)
    cart.lines = cart.lines.filter((i) => i.merchandise?.id !== lineItemId)
  }

  // Update totals
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.cost ? parseFloat(item.cost.totalAmount.amount) : 0)
  }, 0)

  cart.totalQuantity = totalQuantity
  cart.cost = {
    subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalTaxAmount: { amount: '0', currencyCode: 'USD' }
  }

  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  return cart
}

export async function updateCart(
  items: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cart = await getCart()
  const products = loadProducts()

  // Ensure cart has items and lines arrays
  if (!cart.items) cart.items = []
  if (!cart.lines) cart.lines = []

  for (const item of items) {
    const existingIndex = cart.items.findIndex((i) => i.merchandise?.id === item.merchandiseId)
    if (existingIndex >= 0) {
      const existingItem = cart.items[existingIndex]
      const existingLine = cart.lines[existingIndex]

      if (existingItem) {
        existingItem.quantity = item.quantity
      }
      if (existingLine) {
        existingLine.quantity = item.quantity
      }

      // Update cost
      const product = products.find(p => p.id === item.merchandiseId.split('-')[0])
      if (product && existingItem?.cost && existingLine?.cost) {
        const totalAmount = (parseFloat(product.price.toString()) * item.quantity).toString()
        existingItem.cost.totalAmount.amount = totalAmount
        existingLine.cost.totalAmount.amount = totalAmount
      }
    }
  }

  // Update totals
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + (item.cost ? parseFloat(item.cost.totalAmount.amount) : 0)
  }, 0)

  cart.totalQuantity = totalQuantity
  cart.cost = {
    subtotalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalAmount: { amount: totalAmount.toString(), currencyCode: 'USD' },
    totalTaxAmount: { amount: '0', currencyCode: 'USD' }
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

export async function getProductByHandleOrId(identifier: string): Promise<Product | undefined> {
  const products = loadProducts()

  // First try to find by handle
  let product = products.find((p) => p.handle === identifier)

  // If not found, try to find by ID
  if (!product) {
    product = products.find((p) => p.id === identifier)
  }

  return product
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

// ---------- UTILITIES ----------
export async function revalidate(req: any): Promise<any> {
  // For local implementation, we don't need to revalidate with Shopify
  // Just return success response
  return { status: 200, message: 'Revalidation not needed for local data' }
}