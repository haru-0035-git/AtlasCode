'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useParams } from 'next/navigation';

// Define the types for the data fetched from the API
interface Exercise {
  id: number;
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

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch lesson');
        }
        const data = await response.json();
        setLesson(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (isLoading) {
    // This loading state is for the sidebar data, the main content will use loading.tsx
    return <div className="flex justify-center items-center h-screen">サイドバー読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">サイドバーエラー: {error}</div>;
  }

  if (!lesson) {
    return <div className="flex justify-center items-center h-screen">サイドバー情報が見つかりません。</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar lessons={lesson.course.lessons} courseTitle={lesson.course.title} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
