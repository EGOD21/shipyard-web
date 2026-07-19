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
