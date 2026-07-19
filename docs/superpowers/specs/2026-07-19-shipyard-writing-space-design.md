# The Shipyard Writing Space — Design Specification

**Date:** 2026-07-19
**Domain:** theshipyard.cc
**Purpose:** A beautifully branded, minimal writing space for hosting essays, notes, and creative writing

---

## Overview

The Shipyard is a single-page-focused writing platform that prioritizes visual identity and reading experience over complex features. Content is written in Obsidian, published via a lightweight plugin, and displayed on a custom Next.js site with Anchor brand identity.

---

## Goals

1. **Beautiful reading experience** — Clean typography, generous spacing, distraction-free
2. **Effortless publishing workflow** — Write in Obsidian, add `published: true`, done
3. **Strong visual identity** — Anchor brand colors, ship/nautical theme, sophisticated aesthetic
4. **Maximum simplicity** — No unnecessary features, minimal navigation, pure content focus

---

## Architecture

### Tech Stack

- **Site:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Plugin:** Obsidian plugin (TypeScript) for publishing automation
- **Content:** Markdown files with YAML frontmatter
- **Deployment:** Vercel (auto-deploy on Git push)
- **Domain:** theshipyard.cc

### System Flow

```
Obsidian Vault (local)
    ↓
[Plugin watches for published: true]
    ↓
Copies to → /content directory in Next.js repo
    ↓
Git commit + push (automated by plugin)
    ↓
Vercel detects push → rebuilds site
    ↓
Published at theshipyard.cc
```

### Key Architectural Decisions

1. **Static site generation** — All pages generated at build time for speed and SEO
2. **Obsidian as CMS** — No separate CMS interface, Obsidian vault is source of truth
3. **Git as bridge** — Plugin handles Git operations, no manual commits needed
4. **Frontmatter-driven publishing** — `published: true` flag controls visibility
5. **Lightweight plugin** — Debounced file watching, async operations, minimal dependencies

---

## Site Structure

### Pages

**Homepage (`/`)**
- Hero section with ShipyardBG1.png background
- Ship animation focal point (user-provided SVG, placeholder during build)
- Subtle wave SVG textures for visual interest
- Anchor logo (small, top-left or centered in hero)
- Featured/latest piece preview or full text
- Minimal "View Archive" link

**Archive (`/archive`)**
- Clean chronological list of all published pieces
- Each entry shows: title, date, word count, content type (essay/note/creative)
- Inspired by Plastic Labs blog aesthetic
- Click title to read full piece
- No pagination initially (add if list becomes long)

**Reading Page (`/[slug]`)**
- Off-white background (#F6EFE9)
- Centered text column (max-width ~680px)
- Generous margins and padding
- Space Grotesk headings, Inter body text
- Minimal header with Anchor logo (links to home)
- Floating navigation: prev/next arrows + archive link
- Clean metadata display (date, reading time, word count)

### No Other Pages

Pure simplicity. Three page types total.

---

## Visual Identity

### Color Palette

Taken directly from `anchor-brandguide` reference:

- `brand-off-white`: `#F6EFE9` — Background
- `brand-black`: `#000000` — Primary text
- `brand-tan`: `#B8A481` — Accent, links, highlights
- `brand-sage`: `#69867E` — Secondary accent
- `brand-mint`: `#AFBFBB` — Subtle elements
- `brand-gray`: `#767270` — Meta text, captions

### Typography

**Fonts:**
- Display/headings: Space Grotesk (wide letter-spacing for wordmarks: `0.18em`)
- Body text: Inter
- Monospace (if needed): IBM Plex Mono

**Reading Page Typography:**
- Max text width: 680px
- Line height: 1.7 for body text
- Paragraph spacing: 1.5em
- Heading hierarchy: clear size/weight differentiation
- Page padding: 4rem top/bottom, 2rem left/right (mobile: 2rem all sides)

### Design Principles

- **Whitespace over density** — Let content breathe
- **Subtle over flashy** — Animations are slow and gentle
- **Readability first** — Typography optimized for long-form reading
- **Respect motion preferences** — Honor `prefers-reduced-motion`

---

## Ship Animation & SVG Elements

### Hero Ship Animation

**Placement:** Homepage hero section only

**Behavior:**
- Entrance: Ship fades in + subtle upward drift (2-3 seconds on page load)
- Idle state: Very slow continuous animation (gentle bob or drift)
- Performance: GPU-accelerated CSS transforms only (`translate`, `opacity`)

**Implementation:**
- User will provide hero ship SVG separately
- Site designed to accept it as drop-in replacement for placeholder
- Animation defined in CSS, no JavaScript unless needed

### Texture SVG Elements

**Wave patterns:**
- Simple, repeating wave SVG patterns
- Placement: footer backgrounds, subtle page dividers between sections
- Opacity: 0.05-0.1 (barely visible, adds texture without distraction)
- Thin-line style (1-2px strokes)
- Matches nautical theme without overwhelming content

---

## Obsidian Plugin Design

### Plugin Name

`anchor-publisher` (or `shipyard-publisher`)

### Core Functionality

1. **File watcher** — Monitors vault for changes to files with frontmatter
2. **Publishing flag detection** — Looks for `published: true` in YAML frontmatter
3. **File copy** — Copies published `.md` files to Next.js `/content` directory
4. **Git automation** — Commits and pushes changes automatically

### Configuration (Settings Panel)

- **Next.js repo path** — Where to copy files (e.g., `/Users/you/shipyard-web/content`)
- **Auto-commit toggle** — Enable/disable automatic Git operations (default: on)
- **Commit message template** — Default: `"Update: {filename}"`
- **Debounce delay** — Wait time after save before processing (default: 3 seconds)

### User Workflow

1. Write note in Obsidian
2. Add frontmatter:
   ```yaml
   ---
   published: true
   title: "Your Title"
   date: 2026-07-19
   type: essay
   ---
   ```
3. Save file
4. Plugin waits 3 seconds (debounce)
5. Copies file to Next.js repo `/content` directory
6. Runs: `git add . && git commit -m "Update: your-title.md" && git push`
7. Vercel detects push and rebuilds site
8. Content appears on theshipyard.cc

### Unpublishing

- Change `published: true` to `published: false`
- Save file
- Plugin removes file from Next.js repo
- Commits and pushes deletion
- Page disappears from site on next build

### Performance Safeguards

- **Debounced file watching** — 3-second delay after save (no keystroke-by-keystroke reactions)
- **Selective monitoring** — Only watches files with YAML frontmatter
- **Async Git operations** — Non-blocking, runs in background
- **Minimal dependencies** — Only `simple-git` for Git operations
- **Batch commits** — If multiple files change at once, single commit for all

### Error Handling

- Shows Obsidian notification if Git push fails
- Logs errors to Obsidian developer console
- Graceful degradation if Next.js repo path is invalid
- Does not block Obsidian UI or crash on errors

### Performance Target

**Imperceptible.** User should not notice plugin is running.

---

## Content Structure

### Frontmatter Schema

Required fields for all published content:

```yaml
---
published: true
title: "Your Title Here"
date: 2026-07-19
type: essay  # essay | note | creative
---
```

Optional fields:

```yaml
tags: [design, writing, tech]
featured: true
excerpt: "Short preview text for archive page"
```

### File Organization

**Option A: Preserve Obsidian folder structure**

```
/content
  /essays
    my-first-essay.md
    thoughts-on-design.md
  /notes
    quick-note.md
  /creative
    short-story.md
```

**Option B: Flatten all content**

```
/content
  my-first-essay.md
  thoughts-on-design.md
  quick-note.md
  short-story.md
```

**Decision:** Use Option A (preserve folders) for better organization.

### Slug Generation

- Filename becomes URL slug
- Example: `my-essay.md` → `/my-essay`
- Sanitize: lowercase, replace spaces with hyphens, remove special characters

---

## Styling System

### Centralized Design Tokens

All styling values defined in **one place** for easy changes:

**`tailwind.config.ts`:**
- Brand colors
- Font families
- Font sizes and line heights
- Spacing scale
- Animation durations and easing curves

**`app/globals.css`:**
- Global typography defaults
- Heading hierarchy (`h1`-`h6` styles)
- Reading content styles (markdown output)
- Link styles, selection color, etc.

**Component-level:**
- Only use Tailwind classes that reference config
- No inline hex colors
- No magic numbers

### Maintainability Goal

**Change brand-tan from `#B8A481` to another color?**
→ Edit one line in `tailwind.config.ts`
→ Entire site updates

---

## Data Flow

### Publishing Flow

```
1. Write in Obsidian
   ↓
2. Add `published: true` frontmatter
   ↓
3. Save file
   ↓
4. Plugin detects change (after 3s debounce)
   ↓
5. Plugin copies .md to /content in Next.js repo
   ↓
6. Plugin runs: git add, git commit, git push
   ↓
7. Git push triggers Vercel webhook
   ↓
8. Next.js rebuilds static pages
   ↓
9. Site updates at theshipyard.cc
```

### Content Processing (Next.js)

1. **Frontmatter parsing** — Extract metadata (title, date, type) from YAML
2. **Markdown rendering** — Convert markdown to HTML with syntax highlighting
3. **Typography enhancement** — Apply proper quote marks, em dashes, etc.
4. **Slug generation** — Create URL-safe slugs from filenames
5. **Archive ordering** — Sort by date (newest first) on `/archive` page

### Build Process

```
Vercel detects Git push
   ↓
npm install
   ↓
next build (static generation)
   ↓
Deploy to CDN
   ↓
Site live at theshipyard.cc
```

**Build time:** ~30-60 seconds per deploy

---

## Deployment

### Platform: Vercel

**Why Vercel:**
- Zero-config Next.js deployment
- Automatic builds on Git push
- Fast global CDN
- Free tier sufficient for personal writing site
- Custom domain support (theshipyard.cc)

**Setup:**
1. Connect GitHub repo to Vercel
2. Vercel auto-detects Next.js configuration
3. Configure custom domain (theshipyard.cc)
4. Every push to `main` branch triggers rebuild

**Alternative:** Netlify (same benefits, different interface)

### Environment

- No environment variables needed (static site)
- No database (content from markdown files)
- No secrets to manage
- Pure static generation

### Performance Targets

- **Lighthouse score:** 95+ (Performance, Accessibility, SEO, Best Practices)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Optimizations:**
  - Next.js Image component for optimized images
  - Minimal JavaScript (mostly static content)
  - Efficient CSS (Tailwind purged)
  - CDN caching

---

## Content Types

### Essays
- Long-form writing (1000+ words)
- Top-to-bottom reading experience
- Featured prominently on homepage

### Notes
- Shorter observations (100-500 words)
- Quick thoughts, links, micro-posts
- Listed in archive with word count badge

### Creative
- Fiction, poetry, experimental formats
- Same reading layout as essays
- Tagged distinctly in archive

---

## Navigation Design

### Homepage Navigation
- Anchor logo (links to `/`)
- "View Archive" link (subtle, bottom of page)

### Archive Navigation
- Anchor logo (links to `/`)
- List of all pieces (title, date, type, word count)
- Click title → reading page

### Reading Page Navigation
- **Header:** Anchor logo 40px height (top-left corner, 2rem padding, links to `/`)
- **Floating nav:** Prev/Next arrows + "Archive" link
- **Position:** Bottom-center, fixed position, always visible
- **Style:** Minimal, semi-transparent background (rgba(0,0,0,0.05)), fades in after scrolling 200px

---

## Asset Requirements

### Provided by User
- `ShipyardBG1.png` — Hero background image
- `Anchor A NB.PNG` — Anchor logo
- Hero ship SVG — Custom ship illustration (provided later)

### Built During Development
- Wave SVG patterns — Simple, repeating textures
- Favicon — Anchor logo adapted for icon
- Social share images — Open Graph / Twitter Card images

---

## Technical Constraints

### Plugin Performance
- **Debounce delay:** 3 seconds minimum
- **Max file size:** Warn if markdown file > 1MB
- **Git operations:** Timeout after 30 seconds
- **Error recovery:** Retry failed pushes once, then notify user

### Site Performance
- **Max bundle size:** < 500KB JavaScript
- **Image optimization:** All images served via Next.js Image component
- **Lighthouse score:** Maintain 95+ on all metrics

---

## Future Considerations (Out of Scope)

These are explicitly **not** included in initial build:

- Search functionality
- Comments system
- RSS feed (maybe add later)
- Dark mode (single theme only)
- Analytics (can add later via simple script)
- Newsletter integration
- Social sharing buttons
- Table of contents for long posts
- Related posts suggestions

**Philosophy:** Launch with absolute minimum. Add features only if genuinely needed.

---

## Success Criteria

1. **Plugin works seamlessly** — Write → save → site updates within 90 seconds
2. **Beautiful reading experience** — Typography, spacing, colors match vision
3. **Fast site** — Lighthouse 95+, feels instant
4. **Easy to maintain** — Change colors/fonts in one place
5. **Zero friction publishing** — No manual Git, no build commands, just write

---

## Open Questions

None. All design decisions finalized.

---

## References

- Anchor brand reference: `~/Developer/anchor-brandguide`
- Reading experience inspiration: Plastic Labs blog, Cyberspace
- Obsidian plugin docs: https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- Digital Garden plugin (workflow reference): https://docs.forestry.md/

---

**End of Specification**
