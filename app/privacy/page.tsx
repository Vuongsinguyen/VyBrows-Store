import Footer from 'components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            At VYBROWS ACADEMY STORE, we are committed to protecting your privacy and ensuring the security
            of your personal information.
          </p>

          <h2>Information We Collect</h2>
          <p className="mb-6">
            We collect information you provide directly to us, such as when you create an account,
            make a purchase, or contact us for support.
          </p>

          <h3>Personal Information</h3>
          <ul className="mb-6">
            <li>Name and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information</li>
            <li>Order history</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p className="mb-6">
            We use the information we collect to:
          </p>
          <ul className="mb-6">
            <li>Process and fulfill your orders</li>
            <li>Provide customer service</li>
            <li>Send you important updates</li>
            <li>Improve our products and services</li>
          </ul>

          <h2>Information Sharing</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy.
          </p>

          <h2>Data Security</h2>
          <p className="mb-6">
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, please contact us at
            privacy@vybrowsacademy.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
