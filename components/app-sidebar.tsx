"use client"

import { Gamepad2, LibraryBig, MessageSquare, User, LayoutDashboard, Code, LogOut, LogIn, Home, Contact, Info, PackagePlus, CircleUser } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process"
import { url } from "inspector"
import { LoadingSpinner } from "./ui/LoadingSpinner"
import Image from "next/image"

// Menu items.
const userItems = [
  {
    title: "Quizz",
    url: "/quizz",
    icon: Gamepad2,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Cours",
    url: "/cours",
    icon: LibraryBig,
  },
]

const adminItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Generate code",
    url: "/generate",
    icon: Code,
  },
  {
    title: "Create quizz",
    url: "/test",
    icon: PackagePlus
  }
]

const publicItems = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: Contact,
  },
  {
    title: "À propos",
    url: "/about",
    icon: Info,
  },
]

export function AppSidebar() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const navigationItems = status === "loading" ? [] : (isAdmin ? adminItems : userItems)

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center p-4">
              {status === "authenticated" ? (
                <>
                  <CircleUser size={24} className="mr-2" />
                  <span className="truncate uppercase">{session?.user?.username}</span>
                </>
              ) : (
                <span>
                  <Image
                    src="/image/logo.jpg"
                    width={40}
                    height={40}
                    alt="Akti+"
                    className="rounded-full"
                    priority
                  />
                </span>
              )}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {status === "loading" ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="flex items-center">
                      Loading ...
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : status === "unauthenticated" ? (
                <>
                  {publicItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="bg-amber-200">
                          <item.icon className="h-4 w-4 mr-2" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/signin">
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>Se connecter</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="mt-2">
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="bg-red-500 text-white">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {status === "authenticated" && (
          <div className="mt-auto border-t pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/signin' })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
