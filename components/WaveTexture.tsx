interface WaveTextureProps {
  opacity?: number
  className?: string
}

export default function WaveTexture({ opacity = 0.05, className = '' }: WaveTextureProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: 'url(/waves/wave-pattern.svg)',
        backgroundRepeat: 'repeat',
        opacity,
      }}
      aria-hidden="true"
    />
  )
}
