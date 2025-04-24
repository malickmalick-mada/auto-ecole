import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, userId } = await req.json()
    
    if (!code || !userId) {
      return NextResponse.json({ error: "Code and userId are required" }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if code already exists
    const existingCode = await prisma.validationCode.findFirst({
      where: { code }
    })

    if (existingCode) {
      return NextResponse.json({ error: "Code already exists" }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 2)

    // Create validation code with transaction
    const result = await prisma.$transaction(async (tx) => {
      const course = await tx.course.findFirst()
      if (!course) {
        throw new Error("No courses available")
      }

      const validationCode = await tx.validationCode.create({
        data: {
          code,
          userId,
          courseId: course.id,
          expiresAt,
          isUsed: false
        }
      })

      await tx.notification.create({
        data: {
          content: `You have received a new validation code: ${code}`,
          userId,
        }
      })

      return validationCode
    })

    return NextResponse.json({ 
      success: true, 
      validationCode: result 
    })

  } catch (error) {
    console.error('Validation code error:', error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
