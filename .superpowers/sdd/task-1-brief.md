# Task 1: Next.js Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `.gitignore`

**Interfaces:**
- Consumes: Nothing
- Produces: Runnable Next.js dev server at `http://localhost:3000`

## Steps

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
