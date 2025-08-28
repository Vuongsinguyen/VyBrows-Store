import fs from 'fs'
import { cookies } from 'next/headers'
import path from 'path'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  tags?: string[]
}

export type CartItem = {
  productId: string
  quantity: number
}

export type Cart = {
  items: CartItem[]
}

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
  cookies().set('cart', JSON.stringify(cart))
  return cart
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const cart = await getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  cookies().set('cart', JSON.stringify(cart))
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
  cookies().set('cart', JSON.stringify(cart))
  return cart
}

// ---------- PRODUCTS ----------
export async function getProducts(): Promise<Product[]> {
  return loadProducts()
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

// dummy
export async function getPages() {
  return []
}

export async function getPage(handle: string) {
  return null
}

export async function getMenu() {
  return []
}

export async function getProductRecommendations(productId: string) {
  const products = loadProducts()
  return products.slice(0, 3) // demo lấy 3 sản phẩm bất kỳ
}