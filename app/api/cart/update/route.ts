import { NextResponse } from 'next/server'
import { updateCart, getCart } from 'lib/shopify'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchandiseId, quantity } = body
    if (!merchandiseId || typeof quantity !== 'number') return NextResponse.json({ error: 'missing params' }, { status: 400 })

    const cart = await getCart()
    const item = cart.items.find((i: any) => i.merchandise?.id === merchandiseId)
    if (!item) return NextResponse.json({ error: 'item not found' }, { status: 404 })

    await updateCart([{ id: item.id, merchandiseId, quantity }])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}