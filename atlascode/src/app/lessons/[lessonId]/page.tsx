'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';

// Define the types for the data fetched from the API
interface Exercise {
  id: number;
}

interface Lesson {
  id: number;
  title: string;
  content: string | null;
  exercises: Exercise[];
}

interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface LessonDetails extends Lesson {
  course: Course;
}

// In Next.js 15, `params` for a client component is a Promise.
// We use `React.use` to unwrap it.
const LessonPage = ({ params }: { params: Promise<{ lessonId: string }> }) => {
  const { lessonId } = use(params);

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
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">エラー: {error}</div>;
  }

  if (!lesson) {
    return <div className="flex justify-center items-center h-screen">レッスンが見つかりません。</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar lessons={lesson.course.lessons} courseTitle={lesson.course.title} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6">{lesson.title}</h1>
        <div className="prose lg:prose-xl max-w-none">
          <p>{lesson.content}</p>
        </div>

        {lesson.exercises && lesson.exercises.length > 0 && (
          <div className="mt-8">
            <Link href={`/exercises/${lesson.exercises[0].id}`} className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                演習へ進む
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
