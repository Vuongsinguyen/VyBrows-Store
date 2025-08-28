import Footer from 'components/layout/footer';

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Frequently Asked Questions</h1>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">How do I place an order?</h3>
            <p className="text-gray-700">
              Browse our products, add items to your cart, and proceed to checkout.
              You'll need to provide shipping and payment information to complete your order.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
            <p className="text-gray-700">
              We accept all major credit cards, PayPal, and other secure payment methods.
              All transactions are processed securely.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">How long does shipping take?</h3>
            <p className="text-gray-700">
              Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.
              Free shipping on orders over $50.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">What is your return policy?</h3>
            <p className="text-gray-700">
              We offer a 30-day return policy for unused items in original packaging.
              Please see our Shipping & Return Policy for complete details.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">Are your products cruelty-free?</h3>
            <p className="text-gray-700">
              Yes, all our products are cruelty-free and not tested on animals.
              We are committed to ethical beauty practices.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">How do I contact customer service?</h3>
            <p className="text-gray-700">
              You can reach our customer service team at support@vybrowsacademy.com
              or through our contact form. We typically respond within 24 hours.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-3">Do you offer international shipping?</h3>
            <p className="text-gray-700">
              Yes, we ship to most countries worldwide. International shipping rates
              and delivery times vary by location.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Can I change or cancel my order?</h3>
            <p className="text-gray-700">
              Orders can be modified or cancelled within 2 hours of placement.
              Please contact us immediately if you need to make changes.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-4">
            Can't find the answer you're looking for? Our customer service team is here to help!
          </p>
          <a
            href="mailto:support@vybrowsacademy.com"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
