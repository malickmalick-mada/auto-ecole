import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// Get all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, instructor, duration, level, description } = await req.json()

    const course = await prisma.course.create({
      data: {
        title,
        instructor,
        duration,
        level,
        description
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}