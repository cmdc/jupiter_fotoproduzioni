import Script from 'next/script'

interface StructuredDataProps {
  type?: 'LocalBusiness' | 'WebSite' | 'ImageGallery'
  data?: any
}

export function StructuredData({ type = 'LocalBusiness', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jupiterfoto.it'
    
    switch (type) {
      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${baseUrl}#business`,
          "name": "Luigi Bruno Fotografo",
          "alternateName": "Jupiter Foto",
          "description": "Fotografo professionista specializzato in matrimoni e eventi a Potenza, Satriano di Lucania e tutta la Basilicata.",
          "url": baseUrl,
          "telephone": "+39-XXX-XXXXXXX", // Sostituire con numero reale
          "email": "info@jupiterfoto.it", // Sostituire con email reale
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Satriano di Lucania",
            "addressRegion": "Basilicata",
            "addressCountry": "IT"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 40.5167,
            "longitude": 15.6333
          },
          "areaServed": [
            "Basilicata",
            "Potenza",
            "Satriano di Lucania",
            "Matera"
          ],
          "serviceType": [
            "Wedding Photography",
            "Event Photography", 
            "Portrait Photography"
          ],
          "priceRange": "€€€",
          "founder": {
            "@type": "Person",
            "name": "Luigi Bruno"
          },
          "sameAs": [
            // Aggiungere social media quando disponibili
          ]
        }

      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${baseUrl}#website`,
          "url": baseUrl,
          "name": "Luigi Bruno Fotografo",
          "description": "Portfolio fotografico di Luigi Bruno, specializzato in matrimoni e eventi in Basilicata.",
          "publisher": {
            "@type": "Organization",
            "name": "Jupiter Foto",
            "url": baseUrl
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/photography?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }

      case 'ImageGallery':
        return {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": data?.title || "Galleria Fotografica",
          "description": data?.description || "Collezione di fotografie professionali",
          "creator": {
            "@type": "Person",
            "name": "Luigi Bruno"
          },
          "url": data?.url || baseUrl,
          ...(data?.images && {
            "image": data.images.map((img: any) => ({
              "@type": "ImageObject",
              "url": img.src,
              "description": img.alt,
              "width": img.width,
              "height": img.height
            }))
          })
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}