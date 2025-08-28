import Footer from 'components/layout/footer';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">About VYBROWS ACADEMY STORE</h1>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            Welcome to VYBROWS ACADEMY STORE, your premier destination for high-quality beauty and skincare products.
          </p>

          <h2>Our Mission</h2>
          <p className="mb-6">
            We are committed to providing our customers with the finest selection of beauty products,
            ensuring quality, authenticity, and exceptional customer service.
          </p>

          <h2>Our Products</h2>
          <p className="mb-6">
            From premium makeup to advanced skincare solutions, we offer a comprehensive range of products
            designed to enhance your natural beauty and boost your confidence.
          </p>

          <h2>Quality Assurance</h2>
          <p className="mb-6">
            Every product in our store undergoes rigorous quality testing to ensure it meets our high standards
            for safety, efficacy, and customer satisfaction.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
