import fs from 'fs';
import type { Product } from 'lib/shopify/types';
import { baseUrl, validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';
import path from 'path';

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // Load products from local JSON file
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  const products: Product[] = JSON.parse(productsData);

  const productsRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.handle}`,
    lastModified: new Date().toISOString() // Use current date since we don't have updatedAt
  }));

  // Create collection routes from product tags
  const allTags = new Set<string>();
  products.forEach(product => {
    product.tags?.forEach(tag => {
      if (!tag.startsWith('hidden-')) {
        allTags.add(tag);
      }
    });
  });

  const collectionsRoutes = Array.from(allTags).map(tag => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(tag)}`,
    lastModified: new Date().toISOString()
  }));

  // Static pages
  const pagesRoutes = [
    { url: `${baseUrl}/search`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString() }
  ];

  return [...routesMap, ...productsRoutes, ...collectionsRoutes, ...pagesRoutes];
}
