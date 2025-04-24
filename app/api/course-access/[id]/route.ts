import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has a valid validation code
    const validationCode = await prisma.validationCode.findFirst({
      where: {
        userId: session.user.id,
        expiresAt: {
          gt: new Date() // Check if not expired
        }
      }
    })

    if (!validationCode) {
      return NextResponse.json({ error: "No valid code found" }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Course access error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}