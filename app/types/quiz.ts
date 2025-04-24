export interface Quiz {
  id: string
  title: string
  courseId: string
  createdAt: Date
  questions: {
    id: string
    content: string
  }[]
}

export interface Question {
  id: string
  content: string
  options: string[]
  correctAnswer: string
}

export interface QuizAttempt {
  id: string
  score: number
  answers: Record<string, string>
  userId: string
  quizId: string
}