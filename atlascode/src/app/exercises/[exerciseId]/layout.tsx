'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Define the types for the data fetched from the API
interface Exercise {
  id: number;
  lesson_id: number;
  // ... other exercise properties if needed
}

export default function ExerciseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const exerciseId = params.exerciseId as string;

  const [lessonIdFromExercise, setLessonIdFromExercise] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExercise = async () => {
      setIsLoading(true);
      try {
        // Fetch exercise to get lesson_id
        const exerciseResponse = await fetch(`/api/exercises/${exerciseId}`);
        if (!exerciseResponse.ok) {
          const errorData = await exerciseResponse.json();
          throw new Error(errorData.error || 'Failed to fetch exercise for layout');
        }
        const exerciseData: Exercise = await exerciseResponse.json();
        setLessonIdFromExercise(exerciseData.lesson_id);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">コンテンツを読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">エラー: {error}</div>;
  }

  if (!lessonIdFromExercise) {
    return <div className="flex justify-center items-center h-screen">コンテンツが見つかりません。</div>;
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <header className="mb-4">
          <Link href={`/lessons/${lessonIdFromExercise}`} className="text-blue-500 hover:underline">
          &larr; レッスンに戻る
          </Link>
      </header>
      {children}
    </main>
  );
}
