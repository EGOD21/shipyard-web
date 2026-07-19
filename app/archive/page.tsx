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

      <div className="relative min-h-screen pt-32 pb-24 px-8 bg-brand-off-white">
        <WaveTexture opacity={0.05} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight mb-16">
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
