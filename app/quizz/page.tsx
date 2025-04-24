"use client";

import { useEffect, useState } from "react";
import { Book, Clock, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/app/types/quiz";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function QuizzPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quiz");
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0">
            <SidebarTrigger />
          </div>
          <div className="p-6 h-screen overflow-y-auto scrollbar-hide">
            <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{quiz.title}</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      <span>Course ID: {quiz.courseId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="mt-4 w-full bg-red-500 text-white rounded-md py-2 hover:bg-red-200 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className="absolute top-10 p-6 w-full"></div>
    </SidebarProvider>
  );
}
