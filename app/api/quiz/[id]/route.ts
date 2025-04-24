import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

// Get specific quiz
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: true
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}

// Submit quiz attempt
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    if (!body.answers) {
      return NextResponse.json({ error: "No answers provided" }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { questions: true }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score
    let score = 0
    quiz.questions.forEach((question) => {
      if (body.answers[question.id] === question.correctAnswer) {
        score++
      }
    })

    const percentageScore = Math.round((score / quiz.questions.length) * 100)

    try {
      const submission = await prisma.quizSubmission.create({
        data: {
          userId: session.user.id,
          quizId: params.id,
          title: quiz.title,
          answers: body.answers,
          score: percentageScore,
          submittedAt: new Date(),
        }
      })

      return NextResponse.json({ 
        success: true,
        score: percentageScore,
        submission 
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 })
    }
  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ 
      error: "Failed to submit quiz",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}