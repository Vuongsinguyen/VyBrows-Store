const fs = require('fs');

const productsPath = './data/products.json';

// Read products data
const productsData = fs.readFileSync(productsPath, 'utf8');
const products = JSON.parse(productsData);

// Update image URLs for products 7-54
products.forEach((product, index) => {
    if (index >= 6 && index < 54) { // Products 7-54 (0-based index 6-53)
        const productNum = (index + 1).toString().padStart(3, '0');

        // Update images array
        product.images = [
            {
                url: `/images/product${productNum}.svg`,
                altText: product.title,
                width: 800,
                height: 800
            },
            {
                url: `/images/product${productNum}-2.svg`,
                altText: `${product.title} Alternative`,
                width: 800,
                height: 800
            }
        ];

        // Update featuredImage
        product.featuredImage = {
            url: `/images/product${productNum}.svg`,
            altText: product.title,
            width: 800,
            height: 800
        };
    }
});

// Write updated data back to file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('Updated products.json with new dummy image URLs');
