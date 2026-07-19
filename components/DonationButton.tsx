'use client'

export default function DonationButton() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <a
        href="https://buy.stripe.com/5kQ4gy2PF7kqfpE3dC04801"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-tan text-white rounded-full font-body text-sm font-medium hover:bg-brand-sage transition-colors shadow-lg"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        Support
      </a>
    </div>
  )
}
