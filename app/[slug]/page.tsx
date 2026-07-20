import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import FloatingNav from '@/components/FloatingNav'
import WaveTexture from '@/components/WaveTexture'
import VoteButtons from '@/components/VoteButtons'
import DonationButton from '@/components/DonationButton'
import CommentsSection from '@/components/CommentsSection'
import { getContentBySlug, getAllContent } from '@/lib/content'

export async function generateStaticParams() {
  const allContent = await getAllContent()
  return allContent.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = await getContentBySlug(slug)

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

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = await getContentBySlug(slug)

  if (!content) {
    notFound()
  }

  // Get all content to find prev/next (array is sorted newest-first)
  const allContent = await getAllContent()
  const currentIndex = allContent.findIndex((item) => item.slug === slug)
  // Previous = newer article (lower index), Next = older article (higher index)
  const prevSlug = currentIndex > 0 ? allContent[currentIndex - 1].slug : null
  const nextSlug = currentIndex < allContent.length - 1 ? allContent[currentIndex + 1].slug : null

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

            {/* Vote buttons */}
            <VoteButtons slug={content.slug} />

            {/* Comments */}
            <CommentsSection slug={content.slug} />
          </div>
        </article>

        <FloatingNav prevSlug={prevSlug} nextSlug={nextSlug} />
        <DonationButton />
      </div>
    </>
  )
}
