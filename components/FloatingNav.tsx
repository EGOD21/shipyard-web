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
          href="/basin"
          className="text-brand-black hover:text-brand-tan transition-colors font-body text-sm font-medium"
        >
          Basin
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
