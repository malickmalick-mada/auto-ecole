import { QuizSubmissionsList } from '@/components/admin/QuizSubmissionsList'

export default function SubmissionsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Submissions</h1>
      <QuizSubmissionsList />
    </div>
  )
}