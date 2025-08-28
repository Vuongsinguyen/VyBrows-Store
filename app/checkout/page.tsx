import React from 'react'
import { getCart } from 'lib/shopify'

export default async function CheckoutPage() {
  const cart = await getCart()

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Local Checkout</h1>
      {!cart || (cart.items && cart.items.length === 0) ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.items.map((item: any) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-md bg-neutral-100">
                {item.merchandise?.product?.featuredImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.merchandise.product.featuredImage.url} alt={item.merchandise.product.featuredImage.altText || item.merchandise.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <div className="font-medium">{item.merchandise?.title}</div>
                <div className="text-sm text-neutral-500">Quantity: {item.quantity}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
