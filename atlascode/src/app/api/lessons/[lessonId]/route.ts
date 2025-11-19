import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    const parsedLessonId = Number.parseInt(lessonId, 10);
    if (Number.isNaN(parsedLessonId)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: parsedLessonId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: {
                order_index: 'asc',
              },
            },
          },
        },
        exercises: true,
        quizzes: true, // Include quizzes
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
