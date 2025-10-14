'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '@/components/layout/Sidebar';

// Define the types for the data fetched from the API
interface Lesson {
  id: number;
  title: string;
  content: string | null;
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!lesson) {
    return <div className="flex justify-center items-center h-screen">Lesson not found.</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar lessons={lesson.course.lessons} courseTitle={lesson.course.title} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6">{lesson.title}</h1>
        <div className="prose lg:prose-xl max-w-none">
          <p>{lesson.content}</p>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
