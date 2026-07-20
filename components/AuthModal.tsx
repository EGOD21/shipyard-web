'use client'

import { useState, useEffect } from 'react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = mode === 'login'
        ? { email, password }
        : { username, email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        setUsername('')
        setEmail('')
        setPassword('')
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-brand-off-white/95 backdrop-blur rounded-lg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('login')}
              className={`font-body text-sm px-3 py-1 rounded transition-colors ${
                mode === 'login'
                  ? 'bg-brand-tan text-white'
                  : 'text-brand-gray hover:text-brand-sage'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`font-body text-sm px-3 py-1 rounded transition-colors ${
                mode === 'signup'
                  ? 'bg-brand-tan text-white'
                  : 'text-brand-gray hover:text-brand-sage'
              }`}
            >
              Sign Up
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-brand-gray hover:text-brand-sage transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="username" className="block font-body text-sm text-brand-gray mb-1">
                Username (3-20 characters)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                className="w-full px-3 py-2 bg-white border border-brand-tan/20 rounded font-body text-sm focus:outline-none focus:border-brand-sage"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block font-body text-sm text-brand-gray mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-brand-tan/20 rounded font-body text-sm focus:outline-none focus:border-brand-sage"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-body text-sm text-brand-gray mb-1">
              Password {mode === 'signup' && '(min 8 characters)'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 bg-white border border-brand-tan/20 rounded font-body text-sm focus:outline-none focus:border-brand-sage"
            />
          </div>

          {error && (
            <div className="font-body text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-tan hover:bg-brand-sage text-white font-body text-sm py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}
