import type { Metadata } from 'next';

import Prose from 'components/prose';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageSlug = params.page;

  // Define static pages
  const staticPages: Record<string, { title: string; description: string }> = {
    'about': {
      title: 'About Us',
      description: 'Learn more about our store and our mission.'
    },
    'contact': {
      title: 'Contact Us',
      description: 'Get in touch with us for any questions or support.'
    },
    'privacy': {
      title: 'Privacy Policy',
      description: 'Our privacy policy and data handling practices.'
    },
    'terms': {
      title: 'Terms of Service',
      description: 'Terms and conditions for using our service.'
    }
  };

  const page = staticPages[pageSlug];
  if (!page) return notFound();

  return {
    title: page.title,
    description: page.description
  };
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const pageSlug = params.page;

  // Define static pages content
  const staticPages: Record<string, { title: string; body: string; updatedAt: string }> = {
    'about': {
      title: 'About Us',
      body: '<p>Welcome to our store! We are committed to providing high-quality products and excellent customer service.</p><p>Our mission is to offer carefully curated items that bring joy and value to our customers.</p>',
      updatedAt: new Date().toISOString()
    },
    'contact': {
      title: 'Contact Us',
      body: '<p>Get in touch with us:</p><ul><li>Email: contact@store.com</li><li>Phone: (555) 123-4567</li></ul><p>We typically respond within 24 hours.</p>',
      updatedAt: new Date().toISOString()
    },
    'privacy': {
      title: 'Privacy Policy',
      body: '<p>We respect your privacy and are committed to protecting your personal information.</p><p>This is a basic privacy policy. Please consult with a legal professional for a complete policy.</p>',
      updatedAt: new Date().toISOString()
    },
    'terms': {
      title: 'Terms of Service',
      body: '<p>By using our service, you agree to these terms.</p><p>Please read these terms carefully before using our website.</p>',
      updatedAt: new Date().toISOString()
    }
  };

  const page = staticPages[pageSlug];
  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.body} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
