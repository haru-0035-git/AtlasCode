import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const progress = await prisma.progress.findMany({
      where: {
        session_id: sessionId,
      },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error(`Error fetching progress for session ${sessionId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
