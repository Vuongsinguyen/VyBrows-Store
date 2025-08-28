import OpengraphImage from 'components/opengraph-image';

export default async function Image({ params }: { params: { page: string } }) {
  // Define static pages
  const staticPages: Record<string, { title: string }> = {
    'about': { title: 'About Us' },
    'contact': { title: 'Contact Us' },
    'privacy': { title: 'Privacy Policy' },
    'terms': { title: 'Terms of Service' }
  };

  const page = staticPages[params.page];
  const title = page?.title || 'Page Not Found';

  return await OpengraphImage({ title });
}
