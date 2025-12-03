'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Define the types for the data fetched from the API
interface Exercise {
  id: number;
  lesson_id: number;
  // ... other exercise properties if needed
}

interface Quiz {
  id: number;
  title: string;
}

interface Lesson {
  id: number;
  title: string;
  content: string | null;
  exercises: Exercise[];
  quizzes: Quiz[];
}

interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface LessonDetails extends Lesson {
  course: Course;
}


export default function ExerciseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const exerciseId = params.exerciseId as string;

  const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonIdFromExercise, setLessonIdFromExercise] = useState<number | null>(null);

  useEffect(() => {
    if (!exerciseId) return;

    const fetchExerciseAndLesson = async () => {
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

        // Then fetch lesson details using lesson_id to get course info for sidebar
        if (exerciseData.lesson_id) {
            const lessonResponse = await fetch(`/api/lessons/${exerciseData.lesson_id}`);
            if (!lessonResponse.ok) {
                const errorData = await lessonResponse.json();
                throw new Error(errorData.error || 'Failed to fetch lesson details for sidebar');
            }
            const lessonData: LessonDetails = await lessonResponse.json();
            setLessonDetails(lessonData);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseAndLesson();
  }, [exerciseId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">サイドバー読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">サイドバーエラー: {error}</div>;
  }

  if (!lessonDetails || !lessonIdFromExercise) {
    return <div className="flex justify-center items-center h-screen">サイドバー情報が見つかりません。</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar lessons={lessonDetails.course.lessons} courseTitle={lessonDetails.course.title} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-4">
            <Link href={`/lessons/${lessonIdFromExercise}`} className="text-blue-500 hover:underline">
            &larr; レッスンに戻る
            </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
