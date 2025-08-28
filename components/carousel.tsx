import fs from 'fs';
import type { Product } from 'lib/types';
import Link from 'next/link';
import path from 'path';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  // Load products from local JSON file
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  const allProducts: Product[] = JSON.parse(productsData);

  // Filter products with 'hidden-homepage-carousel' tag
  const products = allProducts.filter(product =>
    product.tags?.includes('hidden-homepage-carousel')
  );

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
