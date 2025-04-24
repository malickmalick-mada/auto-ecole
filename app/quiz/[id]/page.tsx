"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

interface Question {
  id: string
  content: string
  options: string[]
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
}

interface QuizSubmission {
  id: string
  answers: Record<string, string>
  submittedAt: string
  score: number
}

export default function QuizPage() {
  const params = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchQuizAndSubmission = async () => {
      try {
        const [quizResponse, submissionResponse] = await Promise.all([
          fetch(`/api/quiz/${params.id}`),
          fetch(`/api/quiz/${params.id}/submission`)
        ])

        const quizData = await quizResponse.json()
        const submissionData = await submissionResponse.json()

        setQuiz(quizData)
        if (submissionData) {
          setHasSubmitted(true)
          setSubmission(submissionData)
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchQuizAndSubmission()
    }
  }, [params.id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!quiz) {
    return <div className="p-6">Loading quiz...</div>
  }

  if (hasSubmitted && submission) {
    const borderColor = submission.score === 0 ? 'border-red-500' : 'border-green-500'
    const iconColor = submission.score === 0 ? 'text-red-500' : 'text-green-500'
    const bgColor = submission.score === 0 ? 'bg-red-50' : 'bg-green-50'
    const textColor = submission.score === 0 ? 'text-red-800' : 'text-green-800'
    const message = submission.score === 0 
      ? "Vous avez complété le quiz, mais vous n'avez pas obtenu de points."
      : "Félicitations! Vous avez complété ce quiz avec succès."

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className={borderColor}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className={iconColor} />
              Quiz Complété
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`${bgColor} p-4 rounded-lg`}>
                <p className={`${textColor} font-semibold`}>
                  {message}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-lg">
                  <span className="font-semibold">Score:</span> {submission.score}%
                </p>
                <p className="text-sm text-gray-500">
                  Soumis le: {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Vous ne pouvez pas repasser ce quiz car vous l'avez déjà complété.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [quiz.questions[currentQuestion].id]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/quiz/${quiz.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          answers,
          title: quiz.title,
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit quiz')
      }
      
      const result = await response.json()
      setHasSubmitted(true)
      setSubmission(result)
      toast.success(`Quiz soumis avec succès! Score: ${result.score}%`)
    } catch (error) {
      console.error('Quiz submission error:', error)
      toast.error('Erreur lors de la soumission du quiz')
    }
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
        <h2 className="text-lg font-semibold mb-4">{question.content}</h2>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full p-3 text-left rounded-lg ${
                answers[question.id] === option
                  ? 'bg-[#5d5d5a] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[question.id]}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!answers[question.id]}
              className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}