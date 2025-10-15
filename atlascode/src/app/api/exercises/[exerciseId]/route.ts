import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  console.log('Fetching exercise with ID:', params.exerciseId);
  try {
    const { exerciseId } = params;
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId, 10) },
    });

    if (!exercise) {
      console.error('Exercise not found with ID:', exerciseId);
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    console.log('Found exercise:', exercise);
    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
