'use client';

import { useState, useEffect } from 'react';
import CourseCard from "@/components/ui/CourseCard";
import { v4 as uuidv4 } from 'uuid';

type Course = {
  id: number;
  title: string;
  description: string | null;
  language: string;
  lessons: {
    id: number;
  }[];
  _count: {
    lessons: number;
  };
};

type Progress = {
  lesson_id: number;
  status: string;
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesResponse, progressResponse] = await Promise.all([
          fetch('/api/courses'),
          fetch(`/api/progress/${sessionId}`),
        ]);

        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        if (!progressResponse.ok) {
          throw new Error('Failed to fetch progress');
        }

        const coursesData = await coursesResponse.json();
        const progressData = await progressResponse.json();

        setCourses(coursesData);
        setProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const calculateProgress = (course: Course) => {
    const totalLessons = course._count.lessons;
    if (totalLessons === 0) {
      return 0;
    }
    const completedLessons = progress.filter(p => {
      const lessonInCourse = course.lessons.some(l => l.id === p.lesson_id);
      return lessonInCourse && p.status === 'completed';
    }).length;
    return (completedLessons / totalLessons) * 100;
  };

  if (isLoading) {
    return <div className="text-center">コースを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">コース一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const firstLessonId = course.lessons[0]?.id;
          const courseProgress = calculateProgress(course);
          return (
            <CourseCard 
              key={course.id} 
              title={course.title}
              description={course.description || ''}
              language={course.language}
              firstLessonId={firstLessonId}
              progress={courseProgress} 
            />
          );
        })}
      </div>
    </div>
  );
}
