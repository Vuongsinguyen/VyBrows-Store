import { getCart } from 'lib/shopify'

export default async function InformationPage() {
  const cart = await getCart()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Checkout – Information</h1>

      {!cart || (cart.items && cart.items.length === 0) ? (
        <p>Your cart is empty.</p>
      ) : (
        <form method="post" action="/checkout/review">
          <div className="space-y-4">
            <label className="block">
              <div className="text-sm font-medium">Full name</div>
              <input name="name" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium">Email</div>
              <input name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium">Address</div>
              <input name="address" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <button type="submit" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">Continue to review</button>
          </div>
        </form>
      )}
    </main>
  )
}
