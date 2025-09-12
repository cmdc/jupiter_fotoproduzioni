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
          "@type": ["LocalBusiness", "ProfessionalService", "Photographer"],
          "@id": `${baseUrl}#business`,
          "name": "Jupiter Fotoproduzioni - Luigi Bruno Fotografo",
          "alternateName": ["Jupiter Foto", "Luigi Bruno Fotografo", "Jupiter Fotoproduzioni"],
          "legalName": "Jupiter Fotoproduzioni",
          "description": "Jupiter Fotoproduzioni, studio fotografico professionale di Luigi Bruno specializzato in matrimoni, eventi aziendali, book matrimoniali e ritratti artistici a Potenza, Satriano di Lucania e tutta la Basilicata. Servizi fotografici di alta qualità per matrimoni, cerimonie religiose, ricevimenti e reportage eventi.",
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
            {
              "@type": "State",
              "name": "Basilicata"
            },
            {
              "@type": "City", 
              "name": "Potenza"
            },
            {
              "@type": "City",
              "name": "Satriano di Lucania"  
            },
            {
              "@type": "City",
              "name": "Matera"
            },
            {
              "@type": "Place",
              "name": "Sud Italia"
            }
          ],
          "serviceType": [
            "Fotografia Matrimoniale",
            "Wedding Photography",
            "Book Matrimoniali", 
            "Event Photography",
            "Reportage Eventi Aziendali",
            "Portrait Photography",
            "Ritratti Artistici",
            "Fotografia Cerimonie Religiose",
            "Engagement Photography",
            "Pre-Wedding Photography",
            "Album Matrimoniali Personalizzati"
          ],
          "hasOfferingCatalog": {
            "@type": "OfferingCatalog",
            "name": "Servizi Fotografici Jupiter Fotoproduzioni",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Servizio Fotografico Matrimoniale Completo",
                  "description": "Servizio fotografico completo per matrimoni incluso reportage cerimonia, ricevimento e book sposi"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Book Matrimoniali Esclusivi",
                  "description": "Servizi fotografici pre-matrimoniali e engagement shoot personalizzati"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "Fotografia Eventi Aziendali",
                  "description": "Reportage fotografici professionali per eventi aziendali e cerimonie"
                }
              }
            ]
          },
          "priceRange": "€€€",
          "founder": {
            "@type": "Person",
            "name": "Luigi Bruno",
            "jobTitle": "Fotografo Professionista",
            "worksFor": {
              "@type": "Organization",
              "name": "Jupiter Fotoproduzioni"
            }
          },
          "employee": {
            "@type": "Person", 
            "name": "Luigi Bruno",
            "jobTitle": "Fotografo Matrimoniale e Eventi"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "50+"
          },
          "openingHours": [
            "Mo-Fr 09:00-19:00",
            "Sa 09:00-20:00" 
          ],
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
          "name": "Jupiter Fotoproduzioni - Luigi Bruno Fotografo",
          "alternateName": "Jupiter Foto",
          "description": "Portfolio fotografico professionale di Jupiter Fotoproduzioni, studio di Luigi Bruno specializzato in matrimoni, eventi aziendali e book matrimoniali in Basilicata. Servizi fotografici di alta qualità a Potenza, Satriano di Lucania e Sud Italia.",
          "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}#organization`,
            "name": "Jupiter Fotoproduzioni",
            "alternateName": "Jupiter Foto",
            "url": baseUrl,
            "founder": {
              "@type": "Person",
              "name": "Luigi Bruno"
            }
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Fotografia Matrimoniale"
            },
            {
              "@type": "Thing", 
              "name": "Eventi Aziendali"
            },
            {
              "@type": "Thing",
              "name": "Book Matrimoniali"
            }
          ],
          "keywords": "Jupiter Fotoproduzioni, Luigi Bruno fotografo, matrimoni Basilicata, eventi Potenza, book matrimoniali, fotografo professionista Basilicata",
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