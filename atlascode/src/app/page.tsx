'use client';

import { useState, useEffect } from 'react';
import CourseCard from "@/components/ui/CourseCard";

// APIから返されるコースの型を定義
type Course = {
  id: number;
  title: string;
  description: string | null;
  language: string;
  lessons: {
    id: number;
  }[];
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const firstLessonId = course.lessons[0]?.id;
          return (
            <CourseCard 
              key={course.id} 
              title={course.title}
              description={course.description || ''}
              language={course.language}
              firstLessonId={firstLessonId}
              // TODO: Implement progress tracking
              progress={0} 
            />
          );
        })}
      </div>
    </div>
  );
}
