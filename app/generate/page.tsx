"use client"

import React, { useEffect, useState } from 'react'
import { Key } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface User {
  id: string
  username: string
  role: string
}

export default function Generate() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isSent, setIsSent] = useState(false)
  const [loading, setLoading] = useState(false)  // Add this line
  const [error, setError] = useState("")  // Rename errorMessage to error to match usage

  useEffect(() => {
    if (status !== "loading" && (!session?.user || session.user.role !== "ADMIN")) {
      redirect('/')
    }
  }, [session, status])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((user: User) => user.role === "USER"))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const generateCode = async () => {
    setLoading(true)
    setError("")
    
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      const response = await fetch('/api/validation-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          userId: selectedUser
        })
      })
    
      const data = await response.json()
    
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save code')
      }
    
      if (data.success && data.validationCode) {
        setGeneratedCode(code)
        setError("")
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save code')
      console.error('Error generating code:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Code Generator</h1>

        <div className='flex flex-col items-center gap-4'>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fff4e3]'
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>

          <button
            onClick={generateCode}
            disabled={!selectedUser}
            className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-[#ffcdab] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            <Key className="h-5 w-5" />
            Generate Code
          </button>

          {generatedCode && (
            <div className='mt-4 p-4 bg-gray-100 rounded-lg w-full text-center'>
              <p className='text-sm text-gray-600 mb-1'>
                Generated Code for {users.find(u => u.id === selectedUser)?.username}:
              </p>
              <span className='font-mono text-3xl font-bold'>{generatedCode}</span>
              {isSent && (
                <p className='text-green-600 mt-2'>
                  Code sent to user's chat successfully!
                </p>
              )}
            </div>
          )}

          {error && (
            <div className='text-red-600 text-sm mt-2 text-center'>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
