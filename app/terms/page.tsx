import Footer from 'components/layout/footer';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>

        <div className="prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using VYBROWS ACADEMY STORE, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p className="mb-6">
            Permission is granted to temporarily access the materials on VYBROWS ACADEMY STORE for personal,
            non-commercial transitory viewing only.
          </p>

          <h2>3. Product Information</h2>
          <p className="mb-6">
            We strive to provide accurate product descriptions and images. However, we do not warrant that
            product descriptions or other content is accurate, complete, or current.
          </p>

          <h2>4. Pricing and Payment</h2>
          <p className="mb-6">
            All prices are subject to change without notice. Payment must be received in full before
            orders are processed.
          </p>

          <h2>5. Returns and Exchanges</h2>
          <p className="mb-6">
            Please refer to our Shipping & Return Policy for detailed information about returns and exchanges.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
