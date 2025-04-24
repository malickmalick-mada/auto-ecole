import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await req.json()
    const targetUserId = userId || session.user.id

    // Find admin user
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })

    if (!admin) {
      return NextResponse.json({ error: "No admin available" }, { status: 404 })
    }

    // Find chat between user and admin, regardless of who initiated it
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            AND: [
              { users: { some: { id: targetUserId } } },
              { users: { some: { id: admin.id } } }
            ]
          },
          {
            AND: [
              { users: { some: { id: admin.id } } },
              { users: { some: { id: targetUserId } } }
            ]
          }
        ]
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        users: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    })

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          users: {
            connect: [
              { id: targetUserId },
              { id: admin.id }
            ]
          }
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  role: true
                }
              }
            }
          },
          users: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        }
      })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}