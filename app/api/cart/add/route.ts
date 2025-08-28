import { NextResponse } from 'next/server'
import { addToCart } from 'lib/shopify'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const selectedVariantId = body.selectedVariantId
    if (!selectedVariantId) return NextResponse.json({ error: 'missing selectedVariantId' }, { status: 400 })

    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }])

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
