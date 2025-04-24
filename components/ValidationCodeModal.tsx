"use client"

import React, { useState } from 'react'

interface ValidationCodeModalProps {
  courseId: string
  onClose: () => void  // Add this prop to the interface
}

export function ValidationCodeModal({ courseId, onClose }: ValidationCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          courseId
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Invalid code')
      }

      onClose()
      window.location.href = `/course/${courseId}`
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enter Validation Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your 6-digit code"
              className="w-full p-2 border rounded-md text-center text-2xl tracking-wider"
              maxLength={6}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-[#ffa45c] text-white py-2 rounded-md hover:bg-[#ffcdab] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Validating...' : 'Validate'}
          </button>
        </form>
      </div>
    </div>
  )
}