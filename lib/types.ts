export interface ContentMeta {
  title: string
  date: string
  type: 'essay' | 'note' | 'creative'
  published: boolean
  excerpt?: string
  tags?: string[]
  featured?: boolean
  'dg-home'?: boolean
}

export interface ContentItem extends ContentMeta {
  slug: string
  content: string
  wordCount: number
  readingTime: number
}

export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface Comment {
  id: string
  slug: string
  userId: string
  username: string
  text: string
  createdAt: string
  updatedAt?: string
}
