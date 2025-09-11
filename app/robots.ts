import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jupiterfoto.it'}/sitemap.xml`,
  }
}