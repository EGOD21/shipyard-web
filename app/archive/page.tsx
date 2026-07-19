import Header from '@/components/Header'
import WaveTexture from '@/components/WaveTexture'
import FilterableArchive from '@/components/FilterableArchive'
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

      <div className="relative min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-8 bg-brand-off-white">
        <WaveTexture opacity={0.05} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-12 md:mb-16">
            Archive
          </h1>

          {allContent.length === 0 ? (
            <p className="font-body text-brand-gray italic">
              No published content yet. Add markdown files to /content to see them here.
            </p>
          ) : (
            <FilterableArchive allContent={allContent} />
          )}
        </div>
      </div>
    </>
  )
}
