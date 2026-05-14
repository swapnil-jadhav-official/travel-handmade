import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/login',
          '/wp-content/',
          '/wp-includes/',
          '/wp-admin/',
          '/wp-login.php',
          '/xmlrpc.php',
        ],
      },
    ],
    sitemap: 'https://www.travelhandmade.com/sitemap.xml',
    host: 'https://www.travelhandmade.com',
  };
}
