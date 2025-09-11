import { MetadataRoute } from 'next'
import { getDataPhotographs, getPhotoSeries } from '@/utils/imagekit-fetches'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jupiterfoto.it'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/photography`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/photo-series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Get photography pages
    const photographyData = await getDataPhotographs()
    const photographyPages = photographyData.props.images.map((photo) => ({
      url: `${baseUrl}/photography/${photo.idc}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Get photo series pages
    const seriesData = await getPhotoSeries()
    const seriesPages = seriesData.props.images.map((series) => ({
      url: `${baseUrl}/photo-series/${series.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...photographyPages, ...seriesPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}