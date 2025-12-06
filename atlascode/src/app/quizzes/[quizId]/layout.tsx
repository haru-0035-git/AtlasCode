'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Define the types for the data fetched from the API
interface Quiz {
  id: number;
  lesson_id: number;
  // ... other quiz properties if needed
}

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const quizId = params.quizId as string;

  const [lessonIdFromQuiz, setLessonIdFromQuiz] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        // Fetch quiz to get lesson_id
        const quizResponse = await fetch(`/api/quizzes/${quizId}`);
        if (!quizResponse.ok) {
          const errorData = await quizResponse.json();
          throw new Error(errorData.error || 'Failed to fetch quiz for layout');
        }
        const quizData: Quiz = await quizResponse.json();
        setLessonIdFromQuiz(quizData.lesson_id);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">コンテンツを読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">エラー: {error}</div>;
  }

  if (!lessonIdFromQuiz) {
    return <div className="flex justify-center items-center h-screen">コンテンツが見つかりません。</div>;
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-4">
            <Link href={`/lessons/${lessonIdFromQuiz}`} className="text-blue-500 hover:underline">
            &larr; レッスンに戻る
            </Link>
        </header>
        {children}
    </main>
  );
}
