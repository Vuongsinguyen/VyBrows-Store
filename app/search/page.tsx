import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import fs from 'fs';
import { defaultSort, sorting } from 'lib/constants';
import type { Product } from 'lib/shopify/types';
import path from 'path';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const rawQ = (searchParams as { [key: string]: string | string[] | undefined })?.q;
  const searchValue = Array.isArray(rawQ) ? rawQ[0] : rawQ;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Load products from local JSON file
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  let allProducts: Product[] = JSON.parse(productsData);

  // Filter products based on search query
  let products = allProducts;
  if (searchValue) {
    const searchLower = searchValue.toLowerCase();
    products = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Simple sorting (you can enhance this based on sortKey and reverse)
  if (sortKey === 'CREATED_AT') {
    // Sort by ID as a proxy for creation date
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
    // For now, sort by price as proxy for best selling
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange?.maxVariantPrice?.amount || '0');
      const priceB = parseFloat(b.priceRange?.maxVariantPrice?.amount || '0');
      const comparison = priceB - priceA; // Higher price first for "best selling"
      return reverse ? -comparison : comparison;
    });
  }
  // For RELEVANCE, keep original order (already filtered by search)

  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
