# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13+ photography portfolio website ("Jupiter Foto") that showcases photography series and projects. The site uses Contentful CMS as a headless CMS for content management and features a modern stack with TypeScript, Tailwind CSS, and Framer Motion.

## Technology Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations (tailwindcss-animate)
- **CMS**: Contentful (using GraphQL API)
- **UI Components**: Radix UI primitives with custom implementations
- **Animations**: Framer Motion
- **Image Optimization**: Next.js Image with custom Contentful loader + Plaiceholder for blur placeholders
- **Icons**: Heroicons and Lucide React
- **Package Manager**: Yarn

## Development Commands

```bash
# Development server
yarn dev

# Production build
yarn build

# Start production server (standalone)
yarn start

# Start production server (Next.js)
yarn start_next

# Lint code
yarn lint
```

## Project Architecture

### App Structure (Next.js App Router)

- `/app` - Main application routes using App Router
  - `layout.tsx` - Root layout with navigation, theme providers, and Google Analytics
  - `page.tsx` - Home page
  - `/photography` - Photography gallery routes
  - `/projects` - Projects showcase
  - `/about` - About page
  - `/@modal` - Parallel route for modal functionality

### Components

- `/components/ui` - Reusable UI components (cards, buttons, navigation, etc.)
- `/components/swiper` - Custom Swiper.js implementation
- `/components/particles.tsx` - Background particle effects
- Custom components built on Radix UI primitives

### Utilities & Libraries

- `/lib` - Shared utilities and configurations
  - `contentful-loader.tsx` - Custom image loader for Contentful
  - `providers.tsx` - Theme and context providers
  - `generate-blur-placeholder.ts` - Image blur placeholder generation
- `/utils` - Utility functions
  - `contentful-graphql.ts` - Contentful GraphQL integration

## Key Configuration

### Path Aliases (tsconfig.json)

```json
{
  "@/*": ["./*"],
  "@components/*": ["./components/*"],
  "@lib/*": ["./lib/*"],
  "@app/*": ["./app/*"],
  "@styles/*": ["./styles/*"]
}
```

### Image Handling

- Custom Contentful image loader with WebP optimization
- Blur placeholders using @plaiceholder/next
- Images served from `images.ctfassets.net`

### Environment Variables

The project requires Contentful API configuration:

- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

## Content Management

The site uses Contentful's GraphQL API for content delivery. Key content types include:

- Photography Series (`photographySeriesCollection`)
- Individual photos with metadata
- Project information

## Build Configuration

- **Output**: Standalone deployment ready
- **Styling**: PostCSS with Tailwind CSS
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js core web vitals configuration

## Development Notes

- The project uses parallel routes for modal functionality (`@modal`)
- Theme switching is implemented with `next-themes`
- Animation states are managed with Framer Motion
- Custom particle background effects enhance the visual experience
- Google Analytics integration is included
