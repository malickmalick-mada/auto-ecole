"use client"

import { useEffect, useState } from 'react'
import { Clock, BookOpen, Users } from "lucide-react"
import { useParams } from 'next/navigation'

interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  level: string
  description: string
  videoUrl?: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (!response.ok) {
          throw new Error('Course not found')
        }
        const data = await response.json()
        setCourse(data)
      } catch (error) {
        setError('Failed to load course')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error || 'Course not found'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>Instructeur: {course.instructor}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>Durée: {course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-5 h-5" />
            <span>Niveau: {course.level}</span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Description du cours</h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contenu du cours</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>Introduction aux concepts de base</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>Exercices pratiques</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>Évaluation des compétences</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}