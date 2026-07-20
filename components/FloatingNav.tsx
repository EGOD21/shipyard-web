'use client'

import Link from 'next/link'

interface FloatingNavProps {
  prevSlug?: string | null
  nextSlug?: string | null
}

export default function FloatingNav({ prevSlug, nextSlug }: FloatingNavProps) {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-6 px-6 py-3 bg-brand-off-white/90 backdrop-blur-sm rounded-full border border-brand-tan/20">
        {prevSlug ? (
          <Link
            href={`/${prevSlug}`}
            className="text-brand-tan hover:text-brand-sage focus:text-brand-sage transition-colors font-body text-sm outline-none"
          >
            ← Previous
          </Link>
        ) : (
          <span className="text-brand-gray/30 font-body text-sm">← Previous</span>
        )}

        <Link
          href="/basin"
          className="text-brand-gray hover:text-brand-sage focus:text-brand-sage transition-colors font-body text-sm font-medium outline-none"
        >
          Basin
        </Link>

        {nextSlug ? (
          <Link
            href={`/${nextSlug}`}
            className="text-brand-tan hover:text-brand-sage focus:text-brand-sage transition-colors font-body text-sm outline-none"
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
