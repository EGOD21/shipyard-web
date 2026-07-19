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
