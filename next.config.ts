export default {
  experimental: {
    // ppr: true,  // Disabled - not supported in current Next.js version
    inlineCss: true,
    useCache: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Local images - no remote patterns needed for local development
    ]
  }
};
