import { getCart } from 'lib/shopify'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const name = form.get('name') as string
  const email = form.get('email') as string
  const address = form.get('address') as string

  const cart = await getCart()

  // In a real app you'd create an order here. For local demo, return a simple page.
  return NextResponse.json({ success: true, name, email, address, cart })
}
