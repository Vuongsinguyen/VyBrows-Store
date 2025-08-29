# VyBrows-Store

A high-performance, server-rendered Next.js App Router ecommerce application with local data implementation.

This store uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more. Currently running with local product data, no external commerce provider integration required.

## About This Store

VyBrows-Store is a customized version of Next.js Commerce template, adapted to run with local data instead of external commerce providers like Shopify. This allows for:

- Faster development and testing
- No dependency on external APIs
- Full control over product data
- Easy customization and deployment

## Features

- 🛒 Shopping cart with persistent state
- 🔍 Product search and filtering
- 📱 Responsive design
- ⚡ Server-side rendering
- 🎨 Modern UI with Tailwind CSS
- 📦 Local product data management
- [BigCommerce](https://github.com/bigcommerce/nextjs-commerce) ([Demo](https://next-commerce-v2.vercel.app/))
- [Ecwid by Lightspeed](https://github.com/Ecwid/ecwid-nextjs-commerce/) ([Demo](https://ecwid-nextjs-commerce.vercel.app/))
- [Geins](https://github.com/geins-io/vercel-nextjs-commerce) ([Demo](https://geins-nextjs-commerce-starter.vercel.app/))
- [Medusa](https://github.com/medusajs/vercel-commerce) ([Demo](https://medusa-nextjs-commerce.vercel.app/))
- [Prodigy Commerce](https://github.com/prodigycommerce/nextjs-commerce) ([Demo](https://prodigy-nextjs-commerce.vercel.app/))
- [Saleor](https://github.com/saleor/nextjs-commerce) ([Demo](https://saleor-commerce.vercel.app/))
- [Shopware](https://github.com/shopwareLabs/vercel-commerce) ([Demo](https://shopware-vercel-commerce-react.vercel.app/))
- [Swell](https://github.com/swellstores/verswell-commerce) ([Demo](https://verswell-commerce.vercel.app/))
- [Umbraco](https://github.com/umbraco/Umbraco.VercelCommerce.Demo) ([Demo](https://vercel-commerce-demo.umbraco.com/))
- [Wix](https://github.com/wix/headless-templates/tree/main/nextjs/commerce) ([Demo](https://wix-nextjs-commerce.vercel.app/))
- [Fourthwall](https://github.com/FourthwallHQ/vercel-commerce) ([Demo](https://vercel-storefront.fourthwall.app/))

> Note: Providers, if you are looking to use similar products for your demo, you can [download these assets](https://drive.google.com/file/d/1q_bKerjrwZgHwCw0ovfUMW6He9VtepO_/view?usp=sharing).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

VyBrows-Store runs with local data, so you only need minimal environment setup:

1. Copy the environment variables from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` as needed (only `SITE_NAME` is required for local development)

3. Install dependencies and run:
   ```bash
   pnpm install
   pnpm dev
   ```

Your store should now be running on [localhost:3000](http://localhost:3000/).

> **Note:** Since this uses local data, you don't need to set up Vercel CLI or external API connections for basic development.

## Customization & Data Management

### Local Product Data
- Product data is stored in `data/products.json`
- Images are stored in `public/images/`
- Use the provided scripts to update products:
  - `analyze-products.js` - Analyze product data
  - `update-products.js` - Update product information
  - `create-dummy-images.sh` - Generate placeholder images

### Switching to External Providers
If you want to connect to an external commerce provider (Shopify, BigCommerce, etc.), you can:

1. Add the provider's implementation in `lib/[provider]/`
2. Update the data fetching functions to use external APIs
3. Configure the appropriate environment variables
4. Update the cart and product components accordingly

The current architecture is designed to be easily adaptable to different commerce backends.
