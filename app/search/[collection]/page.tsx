import { Metadata } from 'next';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import fs from 'fs';
import { defaultSort, sorting } from 'lib/constants';
import type { Product } from 'lib/shopify/types';
import path from 'path';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collectionName = params.collection;

  return {
    title: collectionName.charAt(0).toUpperCase() + collectionName.slice(1).replace(/-/g, ' '),
    description: `Browse our ${collectionName} collection`
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Load products from local JSON file
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  let products: Product[] = JSON.parse(productsData);

  // Filter products by collection (tag)
  const collectionTag = params.collection;
  products = products.filter(product =>
    product.tags?.includes(collectionTag)
  );

  // Simple sorting
  if (sortKey === 'CREATED_AT') {
    products.sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      const comparison = idA - idB;
      return reverse ? -comparison : comparison;
    });
  } else if (sortKey === 'PRICE') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange?.maxVariantPrice?.amount || '0');
      const priceB = parseFloat(b.priceRange?.maxVariantPrice?.amount || '0');
      const comparison = priceA - priceB;
      return reverse ? -comparison : comparison;
    });
  } else if (sortKey === 'BEST_SELLING') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange?.maxVariantPrice?.amount || '0');
      const priceB = parseFloat(b.priceRange?.maxVariantPrice?.amount || '0');
      const comparison = priceB - priceA;
      return reverse ? -comparison : comparison;
    });
  }

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
