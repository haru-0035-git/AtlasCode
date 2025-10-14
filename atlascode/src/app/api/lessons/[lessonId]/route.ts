import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
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
  } finally {
    await prisma.$disconnect();
  }
}
