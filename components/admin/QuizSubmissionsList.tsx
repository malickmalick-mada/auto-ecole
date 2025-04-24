"use client"

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface QuizSubmission {
  id: string
  userId: string
  answers: {
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
  }[]
  score: number
  submittedAt: string
  user: {
    username: string
    email: string
  }
}

export function QuizSubmissionsList() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/quiz-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading submissions...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.user.username}</TableCell>
              <TableCell>{submission.score}%</TableCell>
              <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
              <TableCell>
                <button
                  onClick={() => {/* Implement view details */}}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}