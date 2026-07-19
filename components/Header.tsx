import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-2 left-6 md:left-8 z-50">
      <Link href="/" className="block transition-opacity hover:opacity-70">
        <Image
          src="/images/anchor-logo.png"
          alt="The Shipyard"
          width={40}
          height={40}
          className="h-10 w-10"
          priority
        />
      </Link>
    </header>
  )
}
