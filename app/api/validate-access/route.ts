import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ hasAccess: false })
    }

    // Check for valid validation code
    const validCode = await prisma.validationCode.findFirst({
      where: {
        userId: session.user.id,
        isUsed: true,
        expiresAt: {
          gt: new Date() // Check if not expired
        }
      }
    })

    return NextResponse.json({ hasAccess: !!validCode })
  } catch (error) {
    console.error('Access validation error:', error)
    return NextResponse.json({ hasAccess: false })
  }
}