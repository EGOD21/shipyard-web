import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
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

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
          <h1 className="font-display text-white text-6xl md:text-8xl font-light tracking-tight leading-none mb-6">
            The Shipyard
          </h1>
          <p className="font-body text-white/60 text-lg max-w-xl mb-8">
            A space for humans to just be.
          </p>
          <Link
            href="/archive"
            className="inline-block font-body text-sm text-brand-tan hover:text-white transition-colors"
          >
            View Archive →
          </Link>
        </div>
      </section>

      {/* Featured article banner */}
      {featured && (
        <section className="relative py-8 px-8 bg-brand-off-white border-b border-brand-tan/20">
          <WaveTexture opacity={0.05} />

          <div className="relative z-10 max-w-4xl mx-auto flex items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-light tracking-tight mb-1">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="font-body text-sm text-brand-gray">
                  {featured.excerpt}
                </p>
              )}
            </div>
            <Link
              href={`/${featured.slug}`}
              className="inline-flex items-center font-body text-sm text-brand-tan hover:text-brand-sage transition-colors whitespace-nowrap"
            >
              Read →
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
