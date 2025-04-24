"use client"

import React, { useState, useEffect } from 'react'
import { Send, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

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

export default function Chat() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  // Redirect if admin
  useEffect(() => {
    if (status !== "loading" && session?.user?.role === "ADMIN") {
      redirect('/admin/chat')
    }
  }, [session, status])

  useEffect(() => {
    if (session?.user) {
      initializeChat()
    }
  }, [session])

  const initializeChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id
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
    if (!newMessage.trim() || !session?.user) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          userId: session.user.id
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

  if (!session) {
    return <div>Please sign in to access chat.</div>
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 p-4">
            <SidebarTrigger />
          </div>
          <div className="h-screen w-full flex justify-center items-center p-1 sm:p-4">
            <div className='bg-white w-full max-w-[800px] h-[95vh] sm:h-[90vh] md:h-[85vh] rounded-lg shadow-lg flex flex-col mt-8 sm:mt-12 md:mt-16'>
              <div className='p-1 sm:p-4 border-b'>
                <h2 className='text-base sm:text-lg font-semibold'>Support Chat</h2>
              </div>

              <div className='flex-1 p-1 sm:p-4 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-3 ${
                      message.sender.id === session.user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                        message.sender.id === session.user.id
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-medium mb-1 text-black uppercase">{message.sender.username}</p>
                      <p className='text-white text-sm sm:text-base'>{message.content}</p>
                      <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t p-1 sm:p-4 mb-1 sm:mb-2 md:mb-0'>
                <form onSubmit={handleSubmit} className='flex gap-1 sm:gap-2'>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className='flex-1 rounded-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base border focus:outline-none focus:ring-2 focus:ring-[#ffcdab]'
                  />
                  <button
                    type="submit"
                    className='bg-red-500 text-white rounded-full p-1 sm:p-2 hover:bg-red-400 transition-colors'
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
