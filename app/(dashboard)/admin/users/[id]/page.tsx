"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface QuizSubmission {
  id: string
  quizId: string
  answers: Record<string, string>
  submittedAt: string
  title: string
}

interface TestDrive {
  id: string
  date: string
  createdAt: string
}

interface UserDetails {
  username: string
  email: string
  quizSubmissions: QuizSubmission[]
  testDrives: TestDrive[]
}

export default function UserDetailsPage() {
  const params = useParams()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}/details`)
        const data = await response.json()
        // S'assurer que testDrives est toujours un tableau
        setUserDetails({
          ...data,
          testDrives: data.testDrives || [],
          quizSubmissions: data.quizSubmissions || []
        })
      } catch (error) {
        console.error('Failed to fetch user details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUserDetails()
    }
  }, [params.id])

  if (loading) return <LoadingSpinner />
  if (!userDetails) return <div>User not found</div>

  return (
    <div className="container mx-auto py-6 px-4 h-screen overflow-y-auto scrollbar-hide">
      <h1 className="text-4xl text-red-500 font-bold mb-6">Détails de l'utilisateur</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Information</h2>
          <p><strong>Username:</strong> {userDetails.username}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Essais de conduite</h2>
          {userDetails.testDrives?.length === 0 ? (
            <p>Aucun essai de conduite programmé</p>
          ) : (
            <div className="space-y-4">
              {userDetails.testDrives?.map((testDrive) => (
                <div key={testDrive.id} className="border rounded-lg p-4">
                  <p className="font-medium">
                    {format(new Date(testDrive.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Réservé le {format(new Date(testDrive.createdAt), 'dd/MM/yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">REPONSE QUIZZ</h2>
          {userDetails.quizSubmissions?.length === 0 ? (
            <p>No quiz submissions yet</p>
          ) : (
            <div className="space-y-4">
              {userDetails.quizSubmissions?.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{submission.title}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">Answers:</h4>
                    {Object.entries(submission.answers).map(([questionId, answer]) => (
                      <div key={questionId} className="ml-4 text-sm">
                        <p><strong>Réponse:</strong> {answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}