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
