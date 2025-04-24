"use client"

import React, { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface User {
  id: string
  username: string
  role: string
}

interface Message {
  id: string
  content: string
  createdAt: Date
  sender: {
    id: string
    username: string
    role: string
  }
}

export default function AdminChat() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  // Redirect if not admin
  useEffect(() => {
    if (status !== "loading" && (!session?.user || session.user.role !== "ADMIN")) {
      redirect('/')
    }
  }, [session, status])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      initializeChat()
    }
  }, [selectedUser])

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

  const initializeChat = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser
        })
      })

      if (!response.ok) throw new Error('Failed to initialize chat')
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Chat initialization error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          userId: selectedUser
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      const message = await response.json()
      setMessages(prev => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error('Message sending error:', error)
    }
  }

  if (status === "loading") {
    return <LoadingSpinner/>
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 p-2 sm:p-4">
            <SidebarTrigger />
          </div>
          <div className='h-full w-full flex justify-center items-center p-4'>
            <div className='bg-white w-full sm:w-[600px] lg:w-[800px] h-[550px] sm:h-[700px] rounded-lg shadow-lg flex flex-col'>
              <div className='p-3 sm:p-4 border-b'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0'>
                  <h2 className='text-base sm:text-lg font-semibold'>Admin Support Chat</h2>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className='w-full sm:w-auto rounded-md border px-2 sm:px-3 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5d5d5a]'
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
  
              <div className='flex-1 p-3 sm:p-4 overflow-y-auto'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-3 sm:mb-4 ${
                      message.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                        message.sender.id === session?.user?.id
                          ? 'bg-[#5d5d5a] text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-medium mb-1">{message.sender.username}</p>
                      <p className="text-sm sm:text-base">{message.content}</p>
                      <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
  
              <div className='border-t p-3 sm:p-4'>
                <form onSubmit={handleSubmit} className='flex gap-2'>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!selectedUser}
                    className='flex-1 text-sm sm:text-base rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border focus:outline-none focus:ring-2 focus:ring-[#fff4e3] disabled:bg-gray-100 disabled:cursor-not-allowed'
                  />
                  <button
                    type="submit"
                    disabled={!selectedUser}
                    className='bg-red-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}