'use client'

import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

interface User {
  id: string
  username: string
  email: string
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) return null

  return (
    <>
      <div className="fixed top-2 right-6 md:right-8 z-50 flex items-center h-10">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-brand-gray">{user.username}</span>
            <button
              onClick={handleLogout}
              className="font-body text-sm text-brand-sage hover:text-brand-tan transition-colors"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="font-body text-sm bg-brand-tan hover:bg-brand-sage text-white px-4 py-2 rounded transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchUser}
      />
    </>
  )
}
