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

    const { code, courseId } = await req.json()

    // Check if the validation code exists and is not expired
    const validationCode = await prisma.validationCode.findFirst({
      where: {
        code,
        userId: session.user.id,
        expiresAt: {
          gt: new Date() // Check if not expired
        }
      }
    })

    if (!validationCode) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}