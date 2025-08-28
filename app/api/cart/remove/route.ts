import { NextResponse } from 'next/server'
import { removeFromCart } from 'lib/shopify'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchandiseId } = body
    if (!merchandiseId) return NextResponse.json({ error: 'missing merchandiseId' }, { status: 400 })
    await removeFromCart([merchandiseId])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}