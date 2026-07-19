'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ContentItem } from '@/lib/types'

interface FilterableArchiveProps {
  allContent: ContentItem[]
}

export default function FilterableArchive({ allContent }: FilterableArchiveProps) {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Extract unique types and tags
  const contentTypes = useMemo(() => {
    const types = new Set(allContent.map(item => item.type))
    return ['all', ...Array.from(types)]
  }, [allContent])

  const allTags = useMemo(() => {
    const tags = new Set(allContent.flatMap(item => item.tags || []))
    return ['all', ...Array.from(tags)].sort()
  }, [allContent])

  // Filter content
  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      const typeMatch = selectedType === 'all' || item.type === selectedType
      const tagMatch = selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag))
      return typeMatch && tagMatch
    })
  }, [allContent, selectedType, selectedTag])

  return (
    <>
      {/* Filters */}
      <div className="mb-12 flex flex-col gap-6">
        {/* Type filter */}
        <div>
          <label className="block text-xs uppercase tracking-brand text-brand-tan font-body mb-3">
            Filter by type
          </label>
          <div className="flex gap-2 flex-wrap">
            {contentTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-sm px-4 py-2 rounded font-body transition-colors ${
                  selectedType === type
                    ? 'bg-brand-tan text-white'
                    : 'bg-brand-tan/10 text-brand-tan hover:bg-brand-tan/20'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 1 && (
          <div>
            <label className="block text-xs uppercase tracking-brand text-brand-tan font-body mb-3">
              Filter by tag
            </label>
            <div className="flex gap-2 flex-wrap">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-sm px-4 py-2 rounded font-body transition-colors ${
                    selectedTag === tag
                      ? 'bg-brand-sage text-white'
                      : 'bg-brand-sage/10 text-brand-sage hover:bg-brand-sage/20'
                  }`}
                >
                  {tag === 'all' ? 'All tags' : tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="font-body text-brand-gray mb-16">
        {filteredContent.length} {filteredContent.length === 1 ? 'piece' : 'pieces'}
        {selectedType !== 'all' || selectedTag !== 'all' ? ' (filtered)' : ''}
      </p>

      {/* Content list */}
      {filteredContent.length === 0 ? (
        <p className="font-body text-brand-gray italic">
          No content matches the selected filters.
        </p>
      ) : (
        <div className="space-y-12">
          {filteredContent.map((item) => (
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
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="text-xs px-2 py-1 bg-brand-tan/10 text-brand-tan rounded font-body hover:bg-brand-tan/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
