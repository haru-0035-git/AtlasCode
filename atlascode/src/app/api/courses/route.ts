import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: {
            order_index: 'asc',
          },
          take: 1, // Only take the first lesson
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
