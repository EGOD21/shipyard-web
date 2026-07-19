'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroBackgroundProps {
  mediaUrl?: string
}

export default function HeroBackground({ mediaUrl }: HeroBackgroundProps) {
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)

  useEffect(() => {
    if (!mediaUrl) {
      setMediaType(null)
      return
    }

    const ext = mediaUrl.toLowerCase().split('.').pop()
    if (ext === 'mp4' || ext === 'webm') {
      setMediaType('video')
    } else if (ext === 'gif' || ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp') {
      setMediaType('image')
    }
  }, [mediaUrl])

  // Default background
  if (!mediaUrl || !mediaType) {
    return (
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/shipyard-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
    )
  }

  // Video background
  if (mediaType === 'video') {
    return (
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>
    )
  }

  // Image/GIF background
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={mediaUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  )
}
