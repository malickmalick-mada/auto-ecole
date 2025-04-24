"use client"

import { Clock, BookOpen, Users, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { ValidationCodeModal } from "@/components/ValidationCodeModal"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  level: string
  description: string
  videoUrl?: string
}

export default function CoursPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="absolute top-10 p-6 w-full flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0">
            <SidebarTrigger />
          </div>
          <div className="p-6 h-screen overflow-y-auto scrollbar-hide">
            <h1 className="text-2xl font-bold mb-6">Cours Disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6 pb-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-3">{course.title}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Instructeur: {course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Durée: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Niveau: {course.level}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCourseClick(course.id)}
                    className="mt-6 w-full bg-red-500 text-white rounded-md py-2 hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Accéder au cours
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {showModal && selectedCourseId && (
              <ValidationCodeModal
                courseId={selectedCourseId}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}