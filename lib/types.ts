export interface ContentMeta {
  title: string
  date: string
  type: 'essay' | 'note' | 'creative'
  published: boolean
  excerpt?: string
  tags?: string[]
  featured?: boolean
}

export interface ContentItem extends ContentMeta {
  slug: string
  content: string
  wordCount: number
  readingTime: number
}
