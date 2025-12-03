'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useParams } from 'next/navigation';

// Define types locally
interface Lesson {
    id: number;
    title: string;
}
  
interface Course {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface LessonDetails extends Lesson {
  course: Course;
}

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const { lessonId } = params;

  const [course, setCourse] = useState<Course | null>(null);
  const [fetchedCourseId, setFetchedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!lessonId) return;

      try {
        const lessonRes = await fetch(`/api/lessons/${lessonId}`);
        if (!lessonRes.ok) throw new Error('Failed to fetch lesson details for sidebar');
        const lessonDetails: LessonDetails = await lessonRes.json();
        
        if (lessonDetails.course.id !== fetchedCourseId) {
          setCourse(lessonDetails.course);
          setFetchedCourseId(lessonDetails.course.id);
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      }
    };

    fetchCourseData();
  }, [lessonId, fetchedCourseId]);

  return (
    <div className="flex h-screen">
      <Sidebar 
        lessons={course?.lessons || []} 
        courseTitle={course?.title || 'コースを読み込み中...'} 
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}