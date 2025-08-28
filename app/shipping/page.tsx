import Footer from 'components/layout/footer';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Shipping & Return Policy</h1>

        <div className="prose prose-lg max-w-none">
          <h2>Shipping Information</h2>
          <p className="mb-6">
            We offer fast and reliable shipping to ensure your orders arrive quickly and safely.
          </p>

          <h3>Standard Shipping</h3>
          <ul className="mb-6">
            <li>Delivery within 3-5 business days</li>
            <li>Free shipping on orders over $50</li>
            <li>Tracking information provided</li>
          </ul>

          <h3>Express Shipping</h3>
          <ul className="mb-6">
            <li>Delivery within 1-2 business days</li>
            <li>Additional shipping charges apply</li>
            <li>Available for select locations</li>
          </ul>

          <h2>Return Policy</h2>
          <p className="mb-6">
            We want you to be completely satisfied with your purchase. If you're not happy with your order,
            you may return it within 30 days of delivery.
          </p>

          <h3>Return Conditions</h3>
          <ul className="mb-6">
            <li>Items must be unused and in original packaging</li>
            <li>Return authorization required</li>
            <li>Customer responsible for return shipping costs</li>
            <li>Refunds processed within 5-7 business days</li>
          </ul>

          <h2>Exchanges</h2>
          <p className="mb-6">
            We offer exchanges for different sizes or colors. Please contact our customer service
            team to initiate an exchange.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
