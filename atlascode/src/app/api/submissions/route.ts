import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, exerciseId } = body;

    if (!code || !exerciseId) {
      return NextResponse.json({ error: 'Missing code or exerciseId' }, { status: 400 });
    }

    const originalConsoleLog = console.log;
    originalConsoleLog('Received code:', code);

    let result = '';
    const logs: string[] = [];

    console.log = (...args: any[]) => {
      logs.push(args.map(arg => JSON.stringify(arg)).join(' '));
    };

    try {
      const runnable = new Function(code);
      runnable();
      result = logs.join('\n');
    } catch (e: any) {
      result = e.message;
    } finally {
      console.log = originalConsoleLog;
    }

    originalConsoleLog('Final result:', result);

    const submission = await prisma.submission.create({
      data: {
        exercise_id: parseInt(exerciseId, 10),
        code,
        result,
        session_id: 'anonymous', // FIXME: Replace with actual session management
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in submission API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
