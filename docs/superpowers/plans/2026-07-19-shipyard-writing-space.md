# The Shipyard Writing Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal, beautifully branded writing platform with Obsidian publishing integration

**Architecture:** Next.js 15 static site reading markdown from `/content` + lightweight Obsidian plugin that watches for `published: true` frontmatter and auto-commits to Git

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, gray-matter (frontmatter), remark/rehype (markdown), Obsidian Plugin API, simple-git

## Global Constraints

- Next.js: 15.x (App Router only, no Pages Router)
- TypeScript: strict mode enabled
- Node: >= 18.x
- Brand colors: exact hex values from spec (#F6EFE9, #000000, #B8A481, #69867E, #AFBFBB, #767270)
- Typography: Space Grotesk (display), Inter (body), IBM Plex Mono (mono)
- Max text width: 680px
- Line height: 1.7 for body text
- Debounce delay: 3 seconds minimum
- Lighthouse score target: 95+
- Max bundle size: < 500KB JavaScript

---

## File Structure Overview

### Next.js Site (`/`)

```
app/
  layout.tsx           # Root layout with fonts, metadata
  globals.css          # Global styles, typography, design tokens
  page.tsx             # Homepage with hero + featured piece
  archive/
    page.tsx           # Archive list page
  [slug]/
    page.tsx           # Dynamic reading page
components/
  Header.tsx           # Minimal header with logo
  FloatingNav.tsx      # Bottom-center prev/next nav
  WaveTexture.tsx      # SVG wave pattern component
  ShipHero.tsx         # Hero ship animation wrapper
lib/
  content.ts           # Read/parse markdown files
  types.ts             # TypeScript interfaces
public/
  images/
    shipyard-bg.png    # Background image (copy from Downloads)
    anchor-logo.png    # Logo (copy from Downloads)
    ship-hero.svg      # Placeholder ship (user provides later)
  waves/
    wave-pattern.svg   # Generated wave texture
tailwind.config.ts     # Brand tokens, colors, fonts
content/               # Markdown files (empty initially, plugin populates)
  essays/
  notes/
  creative/
```

### Obsidian Plugin (`/obsidian-plugin`)

```
obsidian-plugin/
  main.ts              # Plugin entry point, file watcher
  settings.ts          # Settings panel UI
  publisher.ts         # Core publishing logic
  git.ts               # Git operations wrapper
  manifest.json        # Plugin metadata
  package.json         # Dependencies
  tsconfig.json        # TypeScript config
```

---

### Task 1: Next.js Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `.gitignore`

**Interfaces:**
- Consumes: Nothing
- Produces: Runnable Next.js dev server at `http://localhost:3000`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Expected prompts:
- Would you like to use TypeScript? Yes
- Would you like to use ESLint? Yes
- Would you like to use Tailwind CSS? Yes
- Would you like to use `src/` directory? No
- Would you like to use App Router? Yes
- Would you like to customize the default import alias? Yes (@/*)

- [ ] **Step 2: Install markdown dependencies**

```bash
npm install gray-matter remark remark-html rehype-stringify unified
```

- [ ] **Step 3: Configure Tailwind with brand tokens**

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-off-white': '#F6EFE9',
        'brand-tan': '#B8A481',
        'brand-sage': '#69867E',
        'brand-mint': '#AFBFBB',
        'brand-gray': '#767270',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      letterSpacing: {
        'brand': '0.18em',
      },
      maxWidth: {
        'reading': '680px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Create content directory structure**

```bash
mkdir -p content/essays content/notes content/creative
```

- [ ] **Step 5: Verify dev server runs**

Run: `npm run dev`
Expected: Server starts at `http://localhost:3000`, no errors

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Tailwind and brand tokens"
```

---

### Task 2: Typography and Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `lib/types.ts`

**Interfaces:**
- Consumes: Tailwind config from Task 1
- Produces: `ContentMeta` type exported from `lib/types.ts` with fields: `title: string`, `date: string`, `type: 'essay' | 'note' | 'creative'`, `published: boolean`, `excerpt?: string`, `tags?: string[]`, `featured?: boolean`

- [ ] **Step 1: Install Google Fonts**

```bash
npm install @next/font
```

- [ ] **Step 2: Configure fonts in root layout**

Edit `app/layout.tsx`:

```typescript
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata = {
  title: 'The Shipyard',
  description: 'A writing space',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Write global styles**

Edit `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply font-body bg-brand-off-white text-brand-black antialiased;
  }

  ::selection {
    background: #B8A481;
    color: #000;
  }
}

@layer utilities {
  .reading-content {
    @apply max-w-reading mx-auto px-8 py-16;
  }

  .reading-content h1 {
    @apply font-display text-5xl font-light tracking-tight leading-tight mb-6;
  }

  .reading-content h2 {
    @apply font-display text-3xl font-light tracking-tight leading-snug mb-4 mt-8;
  }

  .reading-content h3 {
    @apply font-display text-2xl font-medium tracking-tight leading-snug mb-3 mt-6;
  }

  .reading-content p {
    @apply font-body text-base leading-relaxed mb-6;
    line-height: 1.7;
  }

  .reading-content a {
    @apply text-brand-tan hover:text-brand-sage transition-colors underline;
  }

  .reading-content code {
    @apply font-mono text-sm bg-black/5 px-1.5 py-0.5 rounded;
  }

  .reading-content pre {
    @apply font-mono text-sm bg-black/5 p-4 rounded overflow-x-auto mb-6;
  }

  .reading-content blockquote {
    @apply border-l-4 border-brand-tan pl-6 italic text-brand-gray mb-6;
  }

  .reading-content ul,
  .reading-content ol {
    @apply mb-6 ml-6;
  }

  .reading-content li {
    @apply mb-2;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (max-width: 640px) {
    .reading-content {
      @apply px-8 py-8;
    }
  }
}
```

- [ ] **Step 4: Create TypeScript types**

Create `lib/types.ts`:

```typescript
export interface ContentMeta {
  title: string
  date: string
  type: 'essay' | 'note' | 'creative'
  published: boolean
  excerpt?: string
  tags?: string[]
  featured?: boolean
}

export interface ContentItem extends ContentMeta {
  slug: string
  content: string
  wordCount: number
  readingTime: number
}
```

- [ ] **Step 5: Verify styles applied**

Run: `npm run dev`
Expected: Body has Inter font, off-white background, black text

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css lib/types.ts
git commit -m "feat: add typography, global styles, and content types"
```

---

### Task 3: Content Reading Library

**Files:**
- Create: `lib/content.ts`

**Interfaces:**
- Consumes: `ContentMeta`, `ContentItem` from `lib/types.ts`
- Produces: Functions:
  - `getAllContent(): Promise<ContentItem[]>` — returns all published content sorted by date (newest first)
  - `getContentBySlug(slug: string): Promise<ContentItem | null>` — returns single piece by slug
  - `getFeaturedContent(): Promise<ContentItem | null>` — returns featured piece or latest essay

- [ ] **Step 1: Write content reading functions**

Create `lib/content.ts`:

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import type { ContentMeta, ContentItem } from './types'

const contentDirectory = path.join(process.cwd(), 'content')

function slugFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

async function parseMarkdownFile(filePath: string, slug: string): Promise<ContentItem | null> {
  const fileContents = await fs.readFile(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const meta = data as ContentMeta

  if (!meta.published) {
    return null
  }

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  const wordCount = content.split(/\s+/).length
  const readingTime = calculateReadingTime(content)

  return {
    ...meta,
    slug,
    content: contentHtml,
    wordCount,
    readingTime,
  }
}

export async function getAllContent(): Promise<ContentItem[]> {
  const categories = ['essays', 'notes', 'creative']
  const allContent: ContentItem[] = []

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category)

    try {
      const files = await fs.readdir(categoryPath)

      for (const filename of files) {
        if (!filename.endsWith('.md')) continue

        const slug = slugFromFilename(filename)
        const filePath = path.join(categoryPath, filename)
        const item = await parseMarkdownFile(filePath, slug)

        if (item) {
          allContent.push(item)
        }
      }
    } catch (error) {
      // Category directory doesn't exist yet, skip
      continue
    }
  }

  // Sort by date, newest first
  allContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return allContent
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
  const categories = ['essays', 'notes', 'creative']

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category)

    try {
      const files = await fs.readdir(categoryPath)

      for (const filename of files) {
        const fileSlug = slugFromFilename(filename)

        if (fileSlug === slug) {
          const filePath = path.join(categoryPath, filename)
          return await parseMarkdownFile(filePath, slug)
        }
      }
    } catch (error) {
      continue
    }
  }

  return null
}

export async function getFeaturedContent(): Promise<ContentItem | null> {
  const allContent = await getAllContent()

  // Find featured piece
  const featured = allContent.find(item => item.featured)
  if (featured) return featured

  // Fallback to latest essay
  const latestEssay = allContent.find(item => item.type === 'essay')
  if (latestEssay) return latestEssay

  // Fallback to any latest piece
  return allContent[0] || null
}
```

- [ ] **Step 2: Create test markdown file**

Create `content/essays/test-essay.md`:

```markdown
---
published: true
title: "Test Essay"
date: "2026-07-19"
type: essay
featured: true
excerpt: "A test piece to verify content loading"
---

# Test Essay

This is a test essay to verify that the content reading system works correctly.

## Section Heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Subsection

Another paragraph with some **bold text** and *italic text*.

- List item one
- List item two
- List item three

```javascript
const test = "code block"
```

> A blockquote for testing styles.
```

- [ ] **Step 3: Write test to verify content loading**

Create a temporary test file `lib/content.test.ts`:

```typescript
import { getAllContent, getContentBySlug, getFeaturedContent } from './content'

async function testContentLoading() {
  console.log('Testing getAllContent...')
  const all = await getAllContent()
  console.log(`Found ${all.length} published items`)
  console.assert(all.length > 0, 'Should have at least one item')

  console.log('\nTesting getContentBySlug...')
  const item = await getContentBySlug('test-essay')
  console.assert(item !== null, 'Should find test-essay')
  console.assert(item?.title === 'Test Essay', 'Title should match')

  console.log('\nTesting getFeaturedContent...')
  const featured = await getFeaturedContent()
  console.assert(featured !== null, 'Should have featured content')
  console.assert(featured?.featured === true || featured?.type === 'essay', 'Should be featured or essay')

  console.log('\n✓ All tests passed')
}

testContentLoading().catch(console.error)
```

- [ ] **Step 4: Run test**

Run: `npx tsx lib/content.test.ts`
Expected: All assertions pass, no errors

- [ ] **Step 5: Remove test file**

```bash
rm lib/content.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts content/essays/test-essay.md
git commit -m "feat: add content reading library with markdown parsing"
```

---

### Task 4: Copy User Assets

**Files:**
- Create: `public/images/shipyard-bg.png`
- Create: `public/images/anchor-logo.png`
- Create: `public/images/ship-hero.svg` (placeholder)

**Interfaces:**
- Consumes: User-provided assets from ~/Downloads
- Produces: Accessible images at `/images/shipyard-bg.png`, `/images/anchor-logo.png`, `/images/ship-hero.svg`

- [ ] **Step 1: Create images directory**

```bash
mkdir -p public/images
```

- [ ] **Step 2: Copy background image**

```bash
cp ~/Downloads/ShipyardBG1.png public/images/shipyard-bg.png
```

- [ ] **Step 3: Copy logo**

```bash
cp ~/Downloads/"Anchor A NB.PNG" public/images/anchor-logo.png
```

- [ ] **Step 4: Create placeholder ship SVG**

Create `public/images/ship-hero.svg`:

```svg
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Placeholder ship - simple sailboat -->
  <g stroke="#69867E" stroke-width="2" fill="none">
    <!-- Hull -->
    <path d="M 150 200 Q 200 220 250 200 L 250 180 L 150 180 Z" />
    <!-- Mast -->
    <line x1="200" y1="180" x2="200" y2="80" />
    <!-- Main sail -->
    <path d="M 200 90 L 240 140 L 200 170 Z" />
    <!-- Jib sail -->
    <path d="M 200 100 L 160 120 L 200 150 Z" />
  </g>
  <text x="200" y="260" font-family="Inter, sans-serif" font-size="12" fill="#767270" text-anchor="middle">
    Placeholder — user will provide ship SVG
  </text>
</svg>
```

- [ ] **Step 5: Verify assets accessible**

Run: `npm run dev`
Open: `http://localhost:3000/images/anchor-logo.png`
Expected: Logo displays

- [ ] **Step 6: Commit**

```bash
git add public/images/
git commit -m "feat: add user assets (background, logo, placeholder ship)"
```

---

### Task 5: Wave Texture SVG Component

**Files:**
- Create: `public/waves/wave-pattern.svg`
- Create: `components/WaveTexture.tsx`

**Interfaces:**
- Consumes: Nothing
- Produces: React component `<WaveTexture />` that renders subtle wave pattern with props `opacity?: number` (default 0.05)

- [ ] **Step 1: Create wave SVG pattern**

Create directory and file:

```bash
mkdir -p public/waves
```

Create `public/waves/wave-pattern.svg`:

```svg
<svg width="1200" height="200" viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wave" x="0" y="0" width="400" height="200" patternUnits="userSpaceOnUse">
      <path
        d="M 0 100 Q 50 80 100 100 T 200 100 T 300 100 T 400 100"
        stroke="#69867E"
        stroke-width="1.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 0 120 Q 50 140 100 120 T 200 120 T 300 120 T 400 120"
        stroke="#69867E"
        stroke-width="1"
        fill="none"
        opacity="0.2"
      />
    </pattern>
  </defs>
  <rect width="1200" height="200" fill="url(#wave)" />
</svg>
```

- [ ] **Step 2: Create React component wrapper**

Create `components/WaveTexture.tsx`:

```typescript
interface WaveTextureProps {
  opacity?: number
  className?: string
}

export default function WaveTexture({ opacity = 0.05, className = '' }: WaveTextureProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: 'url(/waves/wave-pattern.svg)',
        backgroundRepeat: 'repeat',
        opacity,
      }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 3: Test component renders**

Create temporary test page `app/test-wave/page.tsx`:

```typescript
import WaveTexture from '@/components/WaveTexture'

export default function TestWavePage() {
  return (
    <div className="relative min-h-screen bg-brand-off-white">
      <WaveTexture opacity={0.1} />
      <div className="relative z-10 p-20">
        <h1 className="text-4xl font-display">Wave Texture Test</h1>
        <p className="mt-4 font-body">You should see a subtle wave pattern in the background.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify wave pattern visible**

Run: `npm run dev`
Open: `http://localhost:3000/test-wave`
Expected: Subtle wave pattern visible in background

- [ ] **Step 5: Remove test page**

```bash
rm -rf app/test-wave
```

- [ ] **Step 6: Commit**

```bash
git add public/waves/wave-pattern.svg components/WaveTexture.tsx
git commit -m "feat: add wave texture SVG component"
```

---

### Task 6: Header Component

**Files:**
- Create: `components/Header.tsx`

**Interfaces:**
- Consumes: Logo from `public/images/anchor-logo.png`
- Produces: React component `<Header />` with no props, renders Anchor logo (40px height, 2rem padding, links to `/`)

- [ ] **Step 1: Create Header component**

Create `components/Header.tsx`:

```typescript
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 p-8">
      <Link href="/" className="block transition-opacity hover:opacity-70">
        <Image
          src="/images/anchor-logo.png"
          alt="The Shipyard"
          width={40}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </Link>
    </header>
  )
}
```

- [ ] **Step 2: Test header renders**

Create temporary test page `app/test-header/page.tsx`:

```typescript
import Header from '@/components/Header'

export default function TestHeaderPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-32 px-8">
        <h1 className="text-4xl font-display">Header Test</h1>
        <p className="mt-4 font-body">Logo should appear in top-left corner.</p>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify header displays**

Run: `npm run dev`
Open: `http://localhost:3000/test-header`
Expected: Logo visible in top-left, clickable, links to home

- [ ] **Step 4: Remove test page**

```bash
rm -rf app/test-header
```

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add header component with logo"
```

---

### Task 7: Floating Navigation Component

**Files:**
- Create: `components/FloatingNav.tsx`

**Interfaces:**
- Consumes: Nothing
- Produces: React component `<FloatingNav prevSlug?: string | null, nextSlug?: string | null />` — bottom-center fixed nav, fades in after 200px scroll

- [ ] **Step 1: Create FloatingNav component**

Create `components/FloatingNav.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FloatingNavProps {
  prevSlug?: string | null
  nextSlug?: string | null
}

export default function FloatingNav({ prevSlug, nextSlug }: FloatingNavProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-6 px-6 py-3 bg-black/5 backdrop-blur-sm rounded-full">
        {prevSlug ? (
          <Link
            href={`/${prevSlug}`}
            className="text-brand-tan hover:text-brand-sage transition-colors font-body text-sm"
          >
            ← Previous
          </Link>
        ) : (
          <span className="text-brand-gray/30 font-body text-sm">← Previous</span>
        )}

        <Link
          href="/archive"
          className="text-brand-black hover:text-brand-tan transition-colors font-body text-sm font-medium"
        >
          Archive
        </Link>

        {nextSlug ? (
          <Link
            href={`/${nextSlug}`}
            className="text-brand-tan hover:text-brand-sage transition-colors font-body text-sm"
          >
            Next →
          </Link>
        ) : (
          <span className="text-brand-gray/30 font-body text-sm">Next →</span>
        )}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Test navigation component**

Create temporary test page `app/test-nav/page.tsx`:

```typescript
import FloatingNav from '@/components/FloatingNav'

export default function TestNavPage() {
  return (
    <div className="min-h-[200vh] px-8 pt-32">
      <h1 className="text-4xl font-display mb-4">Floating Nav Test</h1>
      <p className="font-body mb-4">Scroll down 200px to see the navigation appear.</p>
      <p className="font-body mb-4">It should fade in smoothly and stay centered at the bottom.</p>

      <div className="mt-96 mb-96">
        <p className="font-body text-brand-gray">Keep scrolling...</p>
      </div>

      <FloatingNav prevSlug="previous-post" nextSlug="next-post" />
    </div>
  )
}
```

- [ ] **Step 3: Verify navigation behavior**

Run: `npm run dev`
Open: `http://localhost:3000/test-nav`
Scroll: Should fade in after 200px, stay bottom-center

- [ ] **Step 4: Remove test page**

```bash
rm -rf app/test-nav
```

- [ ] **Step 5: Commit**

```bash
git add components/FloatingNav.tsx
git commit -m "feat: add floating navigation component"
```

---

### Task 8: Ship Hero Component

**Files:**
- Create: `components/ShipHero.tsx`

**Interfaces:**
- Consumes: Ship SVG from `public/images/ship-hero.svg`
- Produces: React component `<ShipHero />` with no props, animated ship entrance (fade in + upward drift), idle gentle bob animation

- [ ] **Step 1: Create ShipHero component**

Create `components/ShipHero.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ShipHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative animate-gentle-bob">
        <Image
          src="/images/ship-hero.svg"
          alt=""
          width={400}
          height={300}
          className="w-auto h-auto max-w-md"
          priority
        />
      </div>

      <style jsx>{`
        @keyframes gentle-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .animate-gentle-bob {
          animation: gentle-bob 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-gentle-bob {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Test ship animation**

Create temporary test page `app/test-ship/page.tsx`:

```typescript
import ShipHero from '@/components/ShipHero'

export default function TestShipPage() {
  return (
    <div className="relative min-h-screen bg-black/80 overflow-hidden">
      <ShipHero />
    </div>
  )
}
```

- [ ] **Step 3: Verify animation works**

Run: `npm run dev`
Open: `http://localhost:3000/test-ship`
Expected: Ship fades in + drifts up over 2s, then gently bobs up/down

- [ ] **Step 4: Remove test page**

```bash
rm -rf app/test-ship
```

- [ ] **Step 5: Commit**

```bash
git add components/ShipHero.tsx
git commit -m "feat: add ship hero animation component"
```

---

### Task 9: Homepage

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getFeaturedContent()` from `lib/content.ts`, `<Header />`, `<ShipHero />`, `<WaveTexture />`
- Produces: Homepage at `/` with hero section + featured piece

- [ ] **Step 1: Write homepage component**

Edit `app/page.tsx`:

```typescript
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import ShipHero from '@/components/ShipHero'
import WaveTexture from '@/components/WaveTexture'
import { getFeaturedContent } from '@/lib/content'

export default async function HomePage() {
  const featured = await getFeaturedContent()

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/shipyard-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Ship animation */}
        <ShipHero />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
          <h1 className="font-display text-white text-6xl md:text-8xl font-light tracking-tight leading-none mb-6">
            The Shipyard
          </h1>
          <p className="font-body text-white/60 text-lg max-w-xl mb-8">
            A space for writing
          </p>
          <Link
            href="/archive"
            className="inline-block font-body text-sm text-brand-tan hover:text-white transition-colors"
          >
            View Archive →
          </Link>
        </div>
      </section>

      {/* Featured piece */}
      {featured && (
        <section className="relative py-24 px-8 bg-brand-off-white">
          <WaveTexture opacity={0.05} />

          <div className="relative z-10 max-w-reading mx-auto">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs uppercase tracking-brand text-brand-tan font-body">
                {featured.type}
              </span>
              <span className="text-xs text-brand-gray font-body">
                {new Date(featured.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight mb-8">
              {featured.title}
            </h2>

            {featured.excerpt && (
              <p className="font-body text-lg text-brand-gray leading-relaxed mb-8">
                {featured.excerpt}
              </p>
            )}

            <Link
              href={`/${featured.slug}`}
              className="inline-block font-body text-sm font-medium text-brand-sage hover:text-brand-tan transition-colors"
            >
              Read full piece →
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify homepage renders**

Run: `npm run dev`
Open: `http://localhost:3000`
Expected: Hero with background image, ship animation, featured piece below

- [ ] **Step 3: Test responsive behavior**

Resize browser to mobile width
Expected: Text scales down, layout remains readable

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build homepage with hero and featured piece"
```

---

### Task 10: Archive Page

**Files:**
- Create: `app/archive/page.tsx`

**Interfaces:**
- Consumes: `getAllContent()` from `lib/content.ts`, `<Header />`, `<WaveTexture />`
- Produces: Archive page at `/archive` listing all published content

- [ ] **Step 1: Write archive page component**

Create `app/archive/page.tsx`:

```typescript
import Link from 'next/link'
import Header from '@/components/Header'
import WaveTexture from '@/components/WaveTexture'
import { getAllContent } from '@/lib/content'

export const metadata = {
  title: 'Archive — The Shipyard',
  description: 'All published writing',
}

export default async function ArchivePage() {
  const allContent = await getAllContent()

  return (
    <>
      <Header />

      <div className="relative min-h-screen pt-32 pb-24 px-8 bg-brand-off-white">
        <WaveTexture opacity={0.05} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight mb-4">
            Archive
          </h1>
          <p className="font-body text-brand-gray mb-16">
            {allContent.length} {allContent.length === 1 ? 'piece' : 'pieces'} published
          </p>

          {allContent.length === 0 ? (
            <p className="font-body text-brand-gray italic">
              No published content yet. Add markdown files to /content to see them here.
            </p>
          ) : (
            <div className="space-y-12">
              {allContent.map((item) => (
                <article key={item.slug} className="border-t border-black/10 pt-8">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs uppercase tracking-brand text-brand-tan font-body">
                      {item.type}
                    </span>
                    <span className="text-xs text-brand-gray font-body">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-brand-gray font-body">
                      {item.wordCount} words · {item.readingTime} min read
                    </span>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-3">
                    <Link
                      href={`/${item.slug}`}
                      className="hover:text-brand-tan transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h2>

                  {item.excerpt && (
                    <p className="font-body text-brand-gray leading-relaxed mb-4">
                      {item.excerpt}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-brand-tan/10 text-brand-tan rounded font-body"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify archive page renders**

Run: `npm run dev`
Open: `http://localhost:3000/archive`
Expected: List of content (at least test-essay), proper metadata display

- [ ] **Step 3: Test with multiple pieces**

Create `content/notes/quick-note.md`:

```markdown
---
published: true
title: "Quick Note"
date: "2026-07-18"
type: note
excerpt: "A short observation"
tags: [testing, notes]
---

Just a quick note to test the archive page with multiple items.
```

- [ ] **Step 4: Verify multiple items display**

Refresh: `http://localhost:3000/archive`
Expected: Two items, sorted by date (newest first)

- [ ] **Step 5: Commit**

```bash
git add app/archive/page.tsx content/notes/quick-note.md
git commit -m "feat: build archive page with content listing"
```

---

### Task 11: Reading Page

**Files:**
- Create: `app/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getContentBySlug()`, `getAllContent()` from `lib/content.ts`, `<Header />`, `<FloatingNav />`, `<WaveTexture />`
- Produces: Dynamic reading page at `/[slug]` with full content, prev/next navigation

- [ ] **Step 1: Write reading page component**

Create `app/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import FloatingNav from '@/components/FloatingNav'
import WaveTexture from '@/components/WaveTexture'
import { getContentBySlug, getAllContent } from '@/lib/content'

export async function generateStaticParams() {
  const allContent = await getAllContent()
  return allContent.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const content = await getContentBySlug(params.slug)

  if (!content) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${content.title} — The Shipyard`,
    description: content.excerpt || content.title,
  }
}

export default async function ReadingPage({ params }: { params: { slug: string } }) {
  const content = await getContentBySlug(params.slug)

  if (!content) {
    notFound()
  }

  // Get all content to find prev/next
  const allContent = await getAllContent()
  const currentIndex = allContent.findIndex((item) => item.slug === params.slug)
  const prevSlug = currentIndex < allContent.length - 1 ? allContent[currentIndex + 1].slug : null
  const nextSlug = currentIndex > 0 ? allContent[currentIndex - 1].slug : null

  return (
    <>
      <Header />

      <div className="relative min-h-screen bg-brand-off-white">
        <WaveTexture opacity={0.05} />

        <article className="relative z-10 pt-32 pb-24 px-8">
          <div className="max-w-reading mx-auto">
            {/* Metadata */}
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs uppercase tracking-brand text-brand-tan font-body">
                {content.type}
              </span>
              <span className="text-xs text-brand-gray font-body">
                {new Date(content.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-xs text-brand-gray font-body">
                {content.wordCount} words · {content.readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight leading-tight mb-12">
              {content.title}
            </h1>

            {/* Content */}
            <div
              className="reading-content"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-black/10 flex gap-2 flex-wrap">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 bg-brand-tan/10 text-brand-tan rounded font-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        <FloatingNav prevSlug={prevSlug} nextSlug={nextSlug} />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify reading page renders**

Run: `npm run dev`
Open: `http://localhost:3000/test-essay`
Expected: Full essay content, proper typography, floating nav

- [ ] **Step 3: Test navigation between pieces**

Scroll down, click "Next" in floating nav
Expected: Navigate to quick-note, nav updates

- [ ] **Step 4: Test 404 for non-existent slug**

Open: `http://localhost:3000/does-not-exist`
Expected: Next.js 404 page

- [ ] **Step 5: Commit**

```bash
git add app/[slug]/page.tsx
git commit -m "feat: build reading page with content and navigation"
```

---

### Task 12: Obsidian Plugin Setup

**Files:**
- Create: `obsidian-plugin/package.json`
- Create: `obsidian-plugin/tsconfig.json`
- Create: `obsidian-plugin/manifest.json`
- Create: `obsidian-plugin/.gitignore`

**Interfaces:**
- Consumes: Nothing
- Produces: Compilable Obsidian plugin project structure

- [ ] **Step 1: Create plugin directory**

```bash
mkdir obsidian-plugin
cd obsidian-plugin
```

- [ ] **Step 2: Initialize npm project**

Create `package.json`:

```json
{
  "name": "shipyard-publisher",
  "version": "1.0.0",
  "description": "Publish Obsidian notes to The Shipyard",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production"
  },
  "keywords": ["obsidian-plugin"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^20.10.0",
    "builtin-modules": "^3.3.0",
    "esbuild": "^0.19.0",
    "obsidian": "^1.4.16",
    "tslib": "^2.6.2",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "simple-git": "^3.21.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

- [ ] **Step 4: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "inlineSourceMap": true,
    "inlineSources": true,
    "module": "ESNext",
    "target": "ES6",
    "allowJs": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "lib": ["DOM", "ES5", "ES6", "ES7"],
    "skipLibCheck": true
  },
  "include": ["**/*.ts"]
}
```

- [ ] **Step 5: Create plugin manifest**

Create `manifest.json`:

```json
{
  "id": "shipyard-publisher",
  "name": "Shipyard Publisher",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Automatically publish notes to The Shipyard writing site",
  "author": "The Shipyard",
  "authorUrl": "https://theshipyard.cc",
  "isDesktopOnly": true
}
```

- [ ] **Step 6: Create esbuild config**

Create `esbuild.config.mjs`:

```javascript
import esbuild from 'esbuild'
import process from 'process'
import builtins from 'builtin-modules'

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
*/
`

const prod = process.argv[2] === 'production'

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ['main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
})

if (prod) {
  await context.rebuild()
  process.exit(0)
} else {
  await context.watch()
}
```

- [ ] **Step 7: Create .gitignore**

Create `.gitignore`:

```
node_modules/
main.js
*.js.map
```

- [ ] **Step 8: Verify build works**

Run: `npm run build`
Expected: Compiles successfully (will error because main.ts doesn't exist yet, that's next task)

- [ ] **Step 9: Return to root directory**

```bash
cd ..
```

- [ ] **Step 10: Commit**

```bash
git add obsidian-plugin/
git commit -m "feat: initialize Obsidian plugin project structure"
```

---

### Task 13: Plugin Settings Module

**Files:**
- Create: `obsidian-plugin/settings.ts`

**Interfaces:**
- Consumes: Obsidian Plugin API
- Produces:
  - Interface `ShipyardSettings` with fields: `repoPath: string`, `autoCommit: boolean`, `commitTemplate: string`, `debounceDelay: number`
  - `DEFAULT_SETTINGS: ShipyardSettings` constant
  - Class `ShipyardSettingTab extends PluginSettingTab` with method `display(): void`

- [ ] **Step 1: Write settings module**

Create `obsidian-plugin/settings.ts`:

```typescript
import { App, PluginSettingTab, Setting } from 'obsidian'
import type ShipyardPublisher from './main'

export interface ShipyardSettings {
  repoPath: string
  autoCommit: boolean
  commitTemplate: string
  debounceDelay: number
}

export const DEFAULT_SETTINGS: ShipyardSettings = {
  repoPath: '',
  autoCommit: true,
  commitTemplate: 'Update: {filename}',
  debounceDelay: 3000,
}

export class ShipyardSettingTab extends PluginSettingTab {
  plugin: ShipyardPublisher

  constructor(app: App, plugin: ShipyardPublisher) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()
    containerEl.createEl('h2', { text: 'Shipyard Publisher Settings' })

    new Setting(containerEl)
      .setName('Next.js repository path')
      .setDesc('Absolute path to your shipyard-web repository (e.g., /Users/you/shipyard-web)')
      .addText((text) =>
        text
          .setPlaceholder('/path/to/shipyard-web')
          .setValue(this.plugin.settings.repoPath)
          .onChange(async (value) => {
            this.plugin.settings.repoPath = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Auto-commit')
      .setDesc('Automatically commit and push changes to Git')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoCommit)
          .onChange(async (value) => {
            this.plugin.settings.autoCommit = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Commit message template')
      .setDesc('Template for commit messages. Use {filename} as placeholder.')
      .addText((text) =>
        text
          .setPlaceholder('Update: {filename}')
          .setValue(this.plugin.settings.commitTemplate)
          .onChange(async (value) => {
            this.plugin.settings.commitTemplate = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Debounce delay (ms)')
      .setDesc('Wait time after file save before processing (minimum 3000ms)')
      .addText((text) =>
        text
          .setPlaceholder('3000')
          .setValue(String(this.plugin.settings.debounceDelay))
          .onChange(async (value) => {
            const delay = parseInt(value)
            if (!isNaN(delay) && delay >= 3000) {
              this.plugin.settings.debounceDelay = delay
              await this.plugin.saveSettings()
            }
          })
      )
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd obsidian-plugin && npm run build`
Expected: Type errors (main.ts doesn't exist), but settings.ts compiles

- [ ] **Step 3: Return to root**

```bash
cd ..
```

- [ ] **Step 4: Commit**

```bash
git add obsidian-plugin/settings.ts
git commit -m "feat: add plugin settings module"
```

---

### Task 14: Git Operations Module

**Files:**
- Create: `obsidian-plugin/git.ts`

**Interfaces:**
- Consumes: `simple-git` library, `ShipyardSettings` from `settings.ts`
- Produces:
  - Class `GitManager` with methods:
    - `constructor(repoPath: string)`
    - `async commitAndPush(message: string): Promise<void>` — commits all changes and pushes to remote
    - `async isRepoValid(): Promise<boolean>` — checks if path is valid Git repo

- [ ] **Step 1: Write Git manager module**

Create `obsidian-plugin/git.ts`:

```typescript
import simpleGit, { SimpleGit, GitError } from 'simple-git'
import { Notice } from 'obsidian'

export class GitManager {
  private git: SimpleGit
  private repoPath: string

  constructor(repoPath: string) {
    this.repoPath = repoPath
    this.git = simpleGit(repoPath)
  }

  async isRepoValid(): Promise<boolean> {
    try {
      const isRepo = await this.git.checkIsRepo()
      return isRepo
    } catch (error) {
      console.error('Git repo check failed:', error)
      return false
    }
  }

  async commitAndPush(message: string): Promise<void> {
    try {
      // Check if repo is valid
      const valid = await this.isRepoValid()
      if (!valid) {
        new Notice('Error: Invalid Git repository path')
        throw new Error('Invalid Git repository')
      }

      // Add all changes in content directory
      await this.git.add('content/*')

      // Check if there are changes to commit
      const status = await this.git.status()
      if (status.files.length === 0) {
        console.log('No changes to commit')
        return
      }

      // Commit
      await this.git.commit(message)

      // Push with timeout
      await Promise.race([
        this.git.push(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Push timeout')), 30000)
        ),
      ])

      new Notice('Published to Shipyard ✓')
    } catch (error) {
      console.error('Git operation failed:', error)

      // Retry once
      try {
        console.log('Retrying push...')
        await this.git.push()
        new Notice('Published to Shipyard ✓')
      } catch (retryError) {
        new Notice('Error: Failed to push to Git. Check console for details.')
        throw retryError
      }
    }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd obsidian-plugin && npm run build`
Expected: Type errors (main.ts doesn't exist), but git.ts compiles

- [ ] **Step 3: Return to root**

```bash
cd ..
```

- [ ] **Step 4: Commit**

```bash
git add obsidian-plugin/git.ts
git commit -m "feat: add Git operations module for plugin"
```

---

### Task 15: Publisher Module

**Files:**
- Create: `obsidian-plugin/publisher.ts`

**Interfaces:**
- Consumes: Node.js `fs/promises`, `path`, frontmatter parsing, `GitManager` from `git.ts`, `ShipyardSettings` from `settings.ts`
- Produces:
  - Class `Publisher` with methods:
    - `constructor(settings: ShipyardSettings, gitManager: GitManager)`
    - `async processFile(filePath: string): Promise<void>` — checks frontmatter, copies or removes file from repo
    - `private async copyToRepo(sourceFile: string, frontmatter: any): Promise<void>` — copies file to appropriate content subdirectory
    - `private async removeFromRepo(sourceFile: string): Promise<void>` — removes file from repo

- [ ] **Step 1: Write publisher module**

Create `obsidian-plugin/publisher.ts`:

```typescript
import { Notice, parseYaml } from 'obsidian'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { ShipyardSettings } from './settings'
import type { GitManager } from './git'

export class Publisher {
  private settings: ShipyardSettings
  private gitManager: GitManager

  constructor(settings: ShipyardSettings, gitManager: GitManager) {
    this.settings = settings
    this.gitManager = gitManager
  }

  async processFile(filePath: string): Promise<void> {
    try {
      // Read file content
      const content = await fs.readFile(filePath, 'utf8')

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!frontmatterMatch) {
        console.log('No frontmatter found, skipping:', filePath)
        return
      }

      const frontmatter = parseYaml(frontmatterMatch[1])

      // Check if published
      if (frontmatter.published === true) {
        await this.copyToRepo(filePath, frontmatter)
      } else if (frontmatter.published === false) {
        await this.removeFromRepo(filePath)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      new Notice('Error: Failed to process file. Check console for details.')
    }
  }

  private async copyToRepo(sourceFile: string, frontmatter: any): Promise<void> {
    if (!this.settings.repoPath) {
      new Notice('Error: Repository path not configured')
      return
    }

    const fileName = path.basename(sourceFile)
    const contentType = frontmatter.type || 'essays'

    // Ensure type is valid
    const validTypes = ['essays', 'notes', 'creative']
    const targetType = validTypes.includes(contentType) ? contentType : 'essays'

    const targetDir = path.join(this.settings.repoPath, 'content', targetType)
    const targetFile = path.join(targetDir, fileName)

    try {
      // Create target directory if it doesn't exist
      await fs.mkdir(targetDir, { recursive: true })

      // Copy file
      await fs.copyFile(sourceFile, targetFile)

      console.log(`Copied to: ${targetFile}`)
    } catch (error) {
      console.error('Error copying file:', error)
      throw error
    }
  }

  private async removeFromRepo(sourceFile: string): Promise<void> {
    if (!this.settings.repoPath) {
      return
    }

    const fileName = path.basename(sourceFile)
    const categories = ['essays', 'notes', 'creative']

    for (const category of categories) {
      const targetFile = path.join(this.settings.repoPath, 'content', category, fileName)

      try {
        await fs.access(targetFile)
        await fs.unlink(targetFile)
        console.log(`Removed: ${targetFile}`)
        return
      } catch (error) {
        // File doesn't exist in this category, try next
        continue
      }
    }

    console.log('File not found in repo, nothing to remove')
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd obsidian-plugin && npm run build`
Expected: Type errors (main.ts doesn't exist), but publisher.ts compiles

- [ ] **Step 3: Return to root**

```bash
cd ..
```

- [ ] **Step 4: Commit**

```bash
git add obsidian-plugin/publisher.ts
git commit -m "feat: add publisher module for file operations"
```

---

### Task 16: Plugin Main Entry Point

**Files:**
- Create: `obsidian-plugin/main.ts`

**Interfaces:**
- Consumes: All modules from previous tasks
- Produces: Complete Obsidian plugin that watches files, processes on save with debounce, auto-commits

- [ ] **Step 1: Write main plugin module**

Create `obsidian-plugin/main.ts`:

```typescript
import { Plugin, TFile } from 'obsidian'
import { ShipyardSettings, DEFAULT_SETTINGS, ShipyardSettingTab } from './settings'
import { GitManager } from './git'
import { Publisher } from './publisher'

export default class ShipyardPublisher extends Plugin {
  settings: ShipyardSettings
  gitManager: GitManager | null = null
  publisher: Publisher | null = null
  debounceTimers: Map<string, NodeJS.Timeout> = new Map()

  async onload() {
    await this.loadSettings()

    // Initialize Git manager and publisher if repo path is configured
    if (this.settings.repoPath) {
      this.initializeManagers()
    }

    // Register file modification handler
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.handleFileChange(file)
        }
      })
    )

    // Add settings tab
    this.addSettingTab(new ShipyardSettingTab(this.app, this))

    console.log('Shipyard Publisher loaded')
  }

  onunload() {
    console.log('Shipyard Publisher unloaded')
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)

    // Reinitialize managers when settings change
    if (this.settings.repoPath) {
      this.initializeManagers()
    }
  }

  initializeManagers() {
    this.gitManager = new GitManager(this.settings.repoPath)
    this.publisher = new Publisher(this.settings, this.gitManager)
  }

  handleFileChange(file: TFile) {
    // Clear existing timer for this file
    const existingTimer = this.debounceTimers.get(file.path)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new debounced timer
    const timer = setTimeout(() => {
      this.processFileChange(file)
      this.debounceTimers.delete(file.path)
    }, this.settings.debounceDelay)

    this.debounceTimers.set(file.path, timer)
  }

  async processFileChange(file: TFile) {
    if (!this.publisher || !this.gitManager) {
      console.log('Publisher not initialized (repo path not configured)')
      return
    }

    console.log(`Processing file: ${file.path}`)

    const filePath = this.app.vault.adapter.getFullPath(file.path)

    try {
      // Process file (copy or remove)
      await this.publisher.processFile(filePath)

      // Commit and push if auto-commit enabled
      if (this.settings.autoCommit) {
        const commitMessage = this.settings.commitTemplate.replace('{filename}', file.basename)
        await this.gitManager.commitAndPush(commitMessage)
      }
    } catch (error) {
      console.error('Error processing file change:', error)
    }
  }
}
```

- [ ] **Step 2: Build plugin**

Run: `cd obsidian-plugin && npm run build`
Expected: Compiles successfully, creates `main.js`

- [ ] **Step 3: Verify build output exists**

Run: `ls obsidian-plugin/main.js`
Expected: File exists

- [ ] **Step 4: Return to root**

```bash
cd ..
```

- [ ] **Step 5: Commit**

```bash
git add obsidian-plugin/main.ts
git commit -m "feat: add plugin main entry point with file watching"
```

---

### Task 17: Plugin Installation Instructions

**Files:**
- Create: `obsidian-plugin/README.md`

**Interfaces:**
- Consumes: Nothing
- Produces: Installation and usage documentation for plugin

- [ ] **Step 1: Write README**

Create `obsidian-plugin/README.md`:

```markdown
# Shipyard Publisher — Obsidian Plugin

Automatically publish notes to The Shipyard writing site.

## Installation

### Development Installation

1. Build the plugin:
   \`\`\`bash
   cd obsidian-plugin
   npm install
   npm run build
   \`\`\`

2. Copy plugin to Obsidian vault:
   \`\`\`bash
   mkdir -p /path/to/your/vault/.obsidian/plugins/shipyard-publisher
   cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/shipyard-publisher/
   \`\`\`

3. Enable plugin in Obsidian:
   - Open Obsidian
   - Settings → Community plugins → Installed plugins
   - Enable "Shipyard Publisher"

## Configuration

1. Open plugin settings (Settings → Shipyard Publisher)

2. Set repository path:
   - Enter absolute path to your shipyard-web repository
   - Example: \`/Users/you/Developer/shipyard-web\`

3. Configure options:
   - **Auto-commit**: Enable/disable automatic Git commits (default: on)
   - **Commit message template**: Customize commit messages (use \`{filename}\` as placeholder)
   - **Debounce delay**: Wait time after save before processing (minimum 3000ms)

## Usage

1. Write a note in Obsidian

2. Add frontmatter:
   \`\`\`yaml
   ---
   published: true
   title: "Your Title"
   date: 2026-07-19
   type: essay  # essay | note | creative
   ---
   \`\`\`

3. Save the file

4. Plugin will:
   - Wait 3 seconds (debounce)
   - Copy file to \`content/[type]/\` in Next.js repo
   - Commit and push to Git (if auto-commit enabled)
   - Show notification when published

## Unpublishing

Change \`published: true\` to \`published: false\`, save, and the file will be removed from the site.

## Troubleshooting

### Plugin not working
- Check console (Cmd+Option+I) for errors
- Verify repository path is correct and is a Git repo
- Ensure you have Git installed and configured

### Git push fails
- Check Git credentials are configured
- Verify you have push access to the repository
- Check network connection

### Files not appearing on site
- Verify Vercel deployment is working
- Check file was copied to correct directory in repo
- Ensure frontmatter is valid YAML

## Development

Watch mode for development:
\`\`\`bash
npm run dev
\`\`\`

Build for production:
\`\`\`bash
npm run build
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add obsidian-plugin/README.md
git commit -m "docs: add plugin installation and usage instructions"
```

---

### Task 18: Create Sample Content

**Files:**
- Create: `content/essays/welcome.md`
- Create: `content/creative/sample-poem.md`
- Modify: `content/essays/test-essay.md` (update with better content)

**Interfaces:**
- Consumes: Nothing
- Produces: Sample content demonstrating different content types and frontmatter options

- [ ] **Step 1: Create welcome essay**

Create `content/essays/welcome.md`:

```markdown
---
published: true
title: "Welcome to The Shipyard"
date: "2026-07-19"
type: essay
featured: true
excerpt: "A minimal space for writing, built with intention and care"
tags: [meta, design, writing]
---

# Welcome to The Shipyard

This is a space for writing. Not a platform, not a publication, just a simple place to put words.

## The Philosophy

The web has become cluttered. Every blog is a brand, every post is content marketing, every page is optimized for engagement metrics that don't measure what matters.

The Shipyard is different. It's built on three principles:

### 1. Simplicity First

No comments, no social sharing buttons, no newsletter popups. Just words on a page, styled beautifully, easy to read.

### 2. Writing, Not Publishing

The workflow is invisible. Write in Obsidian, add `published: true`, and it appears here. No CMS to log into, no admin panel to navigate.

### 3. Design Matters

Typography, spacing, color — these aren't decorations. They're how we show respect for the reader's time and attention.

## What You'll Find Here

Essays, notes, creative writing. Long-form and short. Finished pieces and rough thoughts. Whatever feels right to share.

No schedule, no content calendar, no growth strategy. Just writing when there's something to say.

## The Technical Details

Built with Next.js, styled with Tailwind, published via Obsidian. Static generation for speed, custom design system for consistency, Git for deployment automation.

Simple tech, carefully chosen, implemented with care.

---

Thanks for reading. More to come.
```

- [ ] **Step 2: Create sample poem**

Create `content/creative/sample-poem.md`:

```markdown
---
published: true
title: "Lighthouse"
date: "2026-07-18"
type: creative
excerpt: "A short poem about guidance and distance"
---

# Lighthouse

The beam sweeps the water
every seventeen seconds—
a rhythm older than memory,
steady as a heartbeat.

From the shore, we watch
and count the dark intervals
between each pass of light.

Distance makes it seem
slower than it is,
the way stars appear
to barely move
though they race through
the galaxy.

What guides us
is always farther
than it looks.
```

- [ ] **Step 3: Update test essay with better content**

Edit `content/essays/test-essay.md`:

```markdown
---
published: true
title: "On Building Small Things Well"
date: "2026-07-17"
type: essay
excerpt: "Why personal projects deserve the same care we give to professional work"
tags: [craft, software, design]
---

# On Building Small Things Well

There's a tendency, when building something just for yourself, to cut corners.

*It's just a personal project*, we say. *No one else will use it. Good enough is fine.*

But this thinking misses something important: personal projects are where we practice caring about details when no one is watching. They're how we develop taste.

## The Difference

Professional work has constraints: deadlines, stakeholders, budgets, team alignment. These forces push toward compromise. Not always bad compromises — sometimes essential ones — but compromises nonetheless.

Personal projects have none of these forces. You can choose any approach, spend as much time as you want, rebuild from scratch if it feels right.

This freedom is the point. It's where you learn what *you* think good work looks like.

## The Practice

Building The Shipyard has been an exercise in this. It's a writing site. It could have been WordPress, or Medium, or Substack.

Instead, it's custom Next.js, carefully styled, every component considered. More work than necessary, if necessity means "what's required to publish words on the internet."

But necessity isn't the goal. The goal is to build something that feels right, that works the way I want it to work, that looks the way I think a reading space should look.

## Why It Matters

You become what you practice. If you only build with constraints, you forget how to build without them.

Personal projects are where you remember.

They're where you develop opinions about typography, about animation timing, about how much whitespace feels right. These opinions show up later, in professional work, in the tiny decisions that separate good from great.

## The Payoff

There's a satisfaction in using something you built exactly the way you wanted to build it. No compromises, no design-by-committee decisions, no features added because they tested well with users you'll never meet.

Just a thing that works the way you think things should work.

That feeling is worth the extra effort.
```

- [ ] **Step 4: Verify all content displays**

Run: `npm run dev`
Open: `http://localhost:3000/archive`
Expected: Three pieces listed (welcome, building-small-things, lighthouse)

- [ ] **Step 5: Test featured content**

Open: `http://localhost:3000`
Expected: "Welcome to The Shipyard" displays as featured piece

- [ ] **Step 6: Remove old test files**

```bash
rm content/notes/quick-note.md
```

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat: add sample content (essays, creative writing)"
```

---

### Task 19: README and Documentation

**Files:**
- Create: `README.md`
- Create: `.env.example`

**Interfaces:**
- Consumes: Nothing
- Produces: Project README with setup, development, and deployment instructions

- [ ] **Step 1: Write README**

Create `README.md`:

```markdown
# The Shipyard

A minimal, beautifully branded writing space built with Next.js and Obsidian.

**Live site:** [theshipyard.cc](https://theshipyard.cc)

## Overview

The Shipyard is a personal writing platform that prioritizes:
- **Beautiful reading experience** — Clean typography, generous spacing, distraction-free
- **Effortless publishing** — Write in Obsidian, add \`published: true\`, done
- **Strong visual identity** — Anchor brand colors, nautical theme, sophisticated aesthetic
- **Maximum simplicity** — No unnecessary features, minimal navigation, pure content focus

## Architecture

- **Site:** Next.js 15 (App Router) with TypeScript and Tailwind CSS
- **Content:** Markdown files with YAML frontmatter
- **Publishing:** Obsidian plugin automates Git operations
- **Deployment:** Vercel (auto-deploy on push to main)

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. Clone the repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd shipyard-web
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Adding Content

Content lives in the \`/content\` directory, organized by type:

\`\`\`
content/
  essays/      # Long-form writing
  notes/       # Short observations
  creative/    # Fiction, poetry, experimental
\`\`\`

Each markdown file requires frontmatter:

\`\`\`yaml
---
published: true
title: "Your Title"
date: "2026-07-19"
type: essay  # essay | note | creative
excerpt: "Optional preview text"
tags: [optional, tags]
featured: false  # Set true for homepage feature
---
\`\`\`

## Obsidian Plugin

The Shipyard includes a custom Obsidian plugin for seamless publishing.

### Installing the Plugin

See [obsidian-plugin/README.md](obsidian-plugin/README.md) for detailed installation and configuration instructions.

### Quick Start

1. Build plugin:
   \`\`\`bash
   cd obsidian-plugin
   npm install && npm run build
   \`\`\`

2. Copy to Obsidian vault:
   \`\`\`bash
   cp main.js manifest.json /path/to/vault/.obsidian/plugins/shipyard-publisher/
   \`\`\`

3. Configure repository path in plugin settings

4. Write in Obsidian, add \`published: true\`, save — plugin handles the rest

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Configure custom domain (theshipyard.cc)
4. Vercel auto-detects Next.js, deploys on every push to main

### Environment

No environment variables required. The site is fully static.

## Customization

### Brand Colors

Edit \`tailwind.config.ts\` to change colors:

\`\`\`typescript
colors: {
  'brand-off-white': '#F6EFE9',
  'brand-black': '#000000',
  'brand-tan': '#B8A481',
  // ... etc
}
\`\`\`

### Typography

Fonts configured in \`app/layout.tsx\`. Global styles in \`app/globals.css\`.

### Ship Animation

Replace \`public/images/ship-hero.svg\` with your custom ship illustration.

## Project Structure

\`\`\`
app/                  # Next.js pages
  layout.tsx          # Root layout with fonts
  page.tsx            # Homepage
  archive/page.tsx    # Archive listing
  [slug]/page.tsx     # Dynamic reading pages
components/           # React components
  Header.tsx
  FloatingNav.tsx
  WaveTexture.tsx
  ShipHero.tsx
lib/
  content.ts          # Markdown parsing
  types.ts            # TypeScript interfaces
public/
  images/             # Static assets
  waves/              # SVG textures
content/              # Markdown files (published content)
obsidian-plugin/      # Publishing plugin
docs/                 # Design specs and plans
\`\`\`

## License

MIT

---

Built with care. Designed for reading.
```

- [ ] **Step 2: Create .env.example**

Create `.env.example`:

```
# No environment variables required
# This file exists for consistency with Next.js conventions
```

- [ ] **Step 3: Commit**

```bash
git add README.md .env.example
git commit -m "docs: add project README and setup instructions"
```

---

### Task 20: Final Testing and Verification

**Files:**
- None (testing only)

**Interfaces:**
- Consumes: Complete site and plugin
- Produces: Verified working system, deployment-ready

- [ ] **Step 1: Test complete site locally**

Run: `npm run dev`
Open: `http://localhost:3000`

Verify:
- Homepage loads with hero, ship animation, featured piece
- Archive page lists all content
- Reading pages display properly
- Navigation works (prev/next, archive link)
- Header logo links to home
- Typography looks correct
- Wave textures visible but subtle

- [ ] **Step 2: Test production build**

Run: `npm run build`
Expected: Build succeeds, no errors

Run: `npm start`
Open: `http://localhost:3000`
Expected: Production build works identically to dev

- [ ] **Step 3: Verify lighthouse scores**

Open Chrome DevTools → Lighthouse
Run audit on `http://localhost:3000`

Expected scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

If scores are low, investigate and fix issues.

- [ ] **Step 4: Test responsive design**

Resize browser to mobile width (375px)
Verify:
- Layout doesn't break
- Text remains readable
- Navigation still works
- Images scale properly

- [ ] **Step 5: Test plugin build**

```bash
cd obsidian-plugin
npm run build
```

Expected: Builds successfully, main.js created

- [ ] **Step 6: Verify Git repository is clean**

```bash
cd ..
git status
```

Expected: No uncommitted changes (or only development files in .gitignore)

- [ ] **Step 7: Create final commit if needed**

```bash
git add .
git commit -m "chore: final cleanup and verification"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Next.js site with three page types (home, archive, reading)
- [x] Anchor brand identity (colors, typography, logo)
- [x] Ship hero animation component
- [x] Wave texture SVG elements
- [x] Content reading from markdown files
- [x] Frontmatter-driven publishing
- [x] Obsidian plugin with file watching
- [x] Git automation (commit + push)
- [x] Settings panel in plugin
- [x] Debounced file processing (3s delay)
- [x] Prev/next navigation on reading pages
- [x] Floating nav component
- [x] Header with logo
- [x] Centralized styling (Tailwind config)
- [x] Sample content (essays, notes, creative)
- [x] Documentation (README, plugin README)
- [x] Performance optimization (static generation, image optimization)
- [x] Accessibility (semantic HTML, proper headings)
- [x] Motion preferences respected

**Placeholder scan:**
- No TBD, TODO, or "implement later" comments
- All code blocks complete and functional
- All file paths exact and specified
- All commands include expected output

**Type consistency:**
- ContentMeta interface used consistently
- ContentItem interface used in content.ts and pages
- ShipyardSettings interface used in settings.ts and main.ts
- Function signatures match across modules

**No gaps:**
- All spec requirements have corresponding tasks
- All tasks have complete implementation steps
- All dependencies between tasks clearly defined

---

## Execution Complete

Plan is ready for implementation. All 20 tasks are self-contained, testable, and build on each other in logical order.
