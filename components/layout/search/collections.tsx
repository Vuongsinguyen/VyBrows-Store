import clsx from 'clsx';
import fs from 'fs';
import type { Product } from 'lib/types';
import path from 'path';
import { Suspense } from 'react';
import FilterList from './filter';

async function CollectionList() {
  // Load products from local JSON file and extract unique tags as collections
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  const products: Product[] = JSON.parse(productsData);

  // Extract unique tags that don't start with 'hidden-'
  const allTags = new Set<string>();
  products.forEach(product => {
    product.tags?.forEach(tag => {
      if (!tag.startsWith('hidden-')) {
        allTags.add(tag);
      }
    });
  });

  // Convert tags to collection format
  const collections = Array.from(allTags).map(tag => ({
    title: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '),
    path: `/search?q=${encodeURIComponent(tag)}`,
    updatedAt: new Date().toISOString()
  }));

  return <FilterList list={collections} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
