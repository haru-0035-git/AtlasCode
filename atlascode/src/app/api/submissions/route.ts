import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProgressStatus } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, exerciseId, sessionId, testResults, allTestsPassed } = body;

    if (!code || !exerciseId || !sessionId || testResults === undefined || allTestsPassed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId, 10) },
      include: { lesson: true },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    if (allTestsPassed) {
      await prisma.progress.upsert({
        where: {
          session_id_course_id_lesson_id: {
            session_id: sessionId,
            course_id: exercise.lesson.course_id,
            lesson_id: exercise.lesson_id,
          }
        },
        update: { status: ProgressStatus.completed },
        create: {
          session_id: sessionId,
          course_id: exercise.lesson.course_id,
          lesson_id: exercise.lesson_id,
          status: ProgressStatus.completed,
        },
      });
    }

    await prisma.submission.create({
      data: {
        exercise_id: parseInt(exerciseId, 10),
        code,
        result: JSON.stringify(testResults),
        session_id: sessionId,
      },
    });

    return NextResponse.json({ testResults, allTestsPassed });

  } catch (error) {
    console.error('Error in submission API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
