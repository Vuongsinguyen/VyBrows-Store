const fs = require('fs');
const path = require('path');

// Read the current products.json
const productsPath = path.join(__dirname, 'data', 'products.json');
const productsData = fs.readFileSync(productsPath, 'utf-8');
let products = JSON.parse(productsData);

// Update products that don't have the required fields
products = products.map((product, index) => {
  // Skip products that already have all required fields
  if (product.handle && product.priceRange && product.options && product.variants) {
    return product;
  }

  // Generate handle if missing
  if (!product.handle) {
    product.handle = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Add descriptionHtml if missing
  if (!product.descriptionHtml) {
    product.descriptionHtml = `<p>${product.description}</p>`;
  }

  // Convert images array to proper format
  if (product.images && typeof product.images[0] === 'string') {
    product.images = product.images.map(img => ({
      url: img,
      altText: product.title,
      width: 800,
      height: 800
    }));
  }

  // Add featuredImage if missing
  if (!product.featuredImage && product.images && product.images.length > 0) {
    product.featuredImage = product.images[0];
  }

  // Add SEO if missing
  if (!product.seo) {
    product.seo = {
      title: product.title,
      description: product.description
    };
  }

  // Add availableForSale
  if (typeof product.availableForSale === 'undefined') {
    product.availableForSale = true;
  }

  // Add priceRange
  if (!product.priceRange) {
    product.priceRange = {
      minVariantPrice: { amount: product.price.toString(), currencyCode: 'USD' },
      maxVariantPrice: { amount: product.price.toString(), currencyCode: 'USD' }
    };
  }

  // Add options and variants
  if (!product.options || !product.variants) {
    const optionName = product.tags && product.tags.includes('makeup') ? 'Type' : 'Variant';
    const optionValue = product.title.split(' ').pop() || 'Default';

    product.options = [{
      id: optionName.toLowerCase(),
      name: optionName,
      values: [optionValue]
    }];

    product.variants = [{
      id: `variant-${product.id}`,
      title: optionValue,
      availableForSale: true,
      selectedOptions: [{ name: optionName, value: optionValue }],
      price: { amount: product.price.toString(), currencyCode: 'USD' }
    }];
  }

  return product;
});

// Write back to file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('✅ Updated all products with required fields!');
