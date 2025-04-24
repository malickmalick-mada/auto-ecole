import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, userId } = await req.json()
    const senderId = session.user.id
    const targetUserId = userId || senderId

    // Find the chat between admin and user
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            AND: [
              { users: { some: { id: targetUserId } } },
              { users: { some: { id: senderId } } }
            ]
          },
          {
            AND: [
              { users: { some: { id: senderId } } },
              { users: { some: { id: targetUserId } } }
            ]
          }
        ]
      }
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: senderId,
        chatId: chat.id
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}