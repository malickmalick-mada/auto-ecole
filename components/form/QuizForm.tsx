"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface Question {
  content: string
  options: string[]
  correctAnswer: string
}

export default function QuizForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    { content: '', options: ['', '', '', ''], correctAnswer: '' }
  ])

  const addQuestion = () => {
    setQuestions([...questions, { content: '', options: ['', '', '', ''], correctAnswer: '' }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const updatedQuestions = [...questions]
    if (field === 'content' || field === 'correctAnswer') {
      updatedQuestions[index][field] = value
    }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          courseId: courseId.trim(),
          questions: questions.map(q => ({
            content: q.content.trim(),
            options: q.options.map(opt => opt.trim()),
            correctAnswer: q.correctAnswer.trim()
          }))
        })
      })
  
      const responseData = await response.text()
      let data
      try {
        data = JSON.parse(responseData)
      } catch (e) {
        console.error('Response parsing error:', responseData)
        throw new Error('Invalid server response')
      }
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quiz')
      }
  
      console.log('Quiz created successfully:', data)
      router.refresh()
      setTitle('')
      setCourseId('')
      setQuestions([{ content: '', options: ['', '', '', ''], correctAnswer: '' }])
    } catch (error) {
      console.error('Failed to create quiz:', error)
      alert(error instanceof Error ? error.message : 'Failed to create quiz')
    }
  }

  return (
    <SidebarProvider>
      <div className="flex w-full justify-center items-center h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 p-4">
            <SidebarTrigger />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto px-6 scrollbar-hide">
              <form onSubmit={handleSubmit} className="space-y-6 pb-6">
                <div className="space-y-4 bg-white p-6 rounded-lg shadow">
                  <Input
                    placeholder="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  {/* <Input
                    placeholder="Course ID"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                  /> */}
                </div>
  
                <div className="space-y-6">
                  {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Question {questionIndex + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeQuestion(questionIndex)}
                          disabled={questions.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
  
                      <Textarea
                        placeholder="Question content"
                        value={question.content}
                        onChange={(e) => updateQuestion(questionIndex, 'content', e.target.value)}
                        required
                      />
  
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => updateQuestion(questionIndex, 'correctAnswer', option)}
                              className={question.correctAnswer === option ? 'bg-green-100' : ''}
                            >
                              Correct
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
  
                <div className="sticky bottom-0 bg-white p-4 shadow-lg rounded-lg flex justify-between">
                  <Button type="button" onClick={addQuestion} className='bg-red-500'>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                  <Button type="submit" className='bg-red-500'>Create Quiz</Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
