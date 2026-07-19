import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import WaveTexture from '@/components/WaveTexture'

export default function HomePage() {
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

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
          <h1 className="font-display text-white text-6xl md:text-8xl font-light tracking-tight leading-none mb-6">
            The Shipyard
          </h1>
          <Link
            href="/archive"
            className="inline-block font-body text-sm text-brand-tan hover:text-white transition-colors"
          >
            View Archive →
          </Link>
        </div>
      </section>

      {/* Content section */}
      <section className="relative py-24 px-8 bg-brand-off-white">
        <WaveTexture opacity={0.05} />

        <div className="relative z-10 max-w-reading mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
            Writing
          </h2>
        </div>
      </section>
    </>
  )
}
