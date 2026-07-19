import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-50 p-6 md:p-8">
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
