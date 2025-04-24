import React from 'react'
import UsersList from '@/components/users/UsersList'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminInterface() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 p-2 sm:p-4">
            <SidebarTrigger />
          </div>
          <div className="p-4 sm:p-6 mt-8 sm:mt-10">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Users Management</h1>
            <div className="p-3 sm:p-6 rounded-lg shadow overflow-x-auto">
              <UsersList />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
