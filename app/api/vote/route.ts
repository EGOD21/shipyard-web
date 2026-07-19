import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface Vote {
  slug: string
  vote: 'like' | 'dislike'
  timestamp: string
  ip: string
  userAgent: string
  country?: string
  city?: string
}

interface VoteData {
  votes: Vote[]
}

const votesPath = path.join(process.cwd(), 'data', 'votes.json')

async function getVotes(): Promise<VoteData> {
  try {
    const data = await fs.readFile(votesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { votes: [] }
  }
}

async function saveVotes(data: VoteData): Promise<void> {
  const dataDir = path.dirname(votesPath)
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(votesPath, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, vote } = body

    if (!slug || !vote || !['like', 'dislike'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get geo data from Vercel headers
    const country = request.headers.get('x-vercel-ip-country')
    const city = request.headers.get('x-vercel-ip-city')

    const newVote: Vote = {
      slug,
      vote,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      ...(country && { country }),
      ...(city && { city }),
    }

    const data = await getVotes()
    data.votes.push(newVote)
    await saveVotes(data)

    // Return counts for this slug
    const slugVotes = data.votes.filter(v => v.slug === slug)
    const likes = slugVotes.filter(v => v.vote === 'like').length
    const dislikes = slugVotes.filter(v => v.vote === 'dislike').length

    return NextResponse.json({ likes, dislikes })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    const data = await getVotes()
    const slugVotes = data.votes.filter(v => v.slug === slug)
    const likes = slugVotes.filter(v => v.vote === 'like').length
    const dislikes = slugVotes.filter(v => v.vote === 'dislike').length

    return NextResponse.json({ likes, dislikes })
  } catch (error) {
    console.error('Get votes error:', error)
    return NextResponse.json({ error: 'Failed to get votes' }, { status: 500 })
  }
}
