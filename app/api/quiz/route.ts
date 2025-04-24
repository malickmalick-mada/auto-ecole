import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true
      }
    })
    
    return NextResponse.json(quizzes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, courseId, questions } = await req.json()

    const quiz = await prisma.quiz.create({
      data: {
        title,
        courseId,
        questions: {
          create: questions.map((q: any) => ({
            content: q.content,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        }
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    )
  }
}