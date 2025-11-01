import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(request: Request) {
  try {
    const { quizId, sessionId, answers } = await request.json();

    if (!quizId || !sessionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctCount = 0;
    const submissionResults = [];

    for (const userAnswer of answers) {
      const question = quiz.questions.find(
        (q) => q.id === userAnswer.questionId
      );

      if (!question) {
        submissionResults.push({
          questionId: userAnswer.questionId,
          isCorrect: false,
          message: 'Question not found',
        });
        continue;
      }

      // 回答が配列であることを確認し、ソートして比較
      const userAnswersSorted = Array.isArray(userAnswer.selectedOptions)
        ? userAnswer.selectedOptions.sort()
        : [userAnswer.selectedOptions].sort();
      const correctAnswersSorted = question.answer.sort();

      const isCorrect = JSON.stringify(userAnswersSorted) === JSON.stringify(correctAnswersSorted);

      if (isCorrect) {
        correctCount++;
      }

      submissionResults.push({
        questionId: question.id,
        isCorrect: isCorrect,
        correctAnswer: question.answer,
        userAnswer: userAnswer.selectedOptions,
      });

      // QuizSubmission に保存 (Upsert を使用)
      await prisma.quizSubmission.upsert({
        where: {
          session_id_quiz_id_question_id: {
            session_id: sessionId,
            quiz_id: quizId,
            question_id: question.id,
          },
        },
        update: {
          answer: userAnswersSorted,
          is_correct: isCorrect,
          submitted_at: new Date(),
        },
        create: {
          session_id: sessionId,
          quiz_id: quizId,
          question_id: question.id,
          answer: userAnswersSorted,
          is_correct: isCorrect,
        },
      });
    }

    return NextResponse.json({
      quizId: quizId,
      sessionId: sessionId,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      score: (correctCount / quiz.questions.length) * 100,
      results: submissionResults,
    });
  } catch (error) {
    console.error('--- DETAILED ERROR IN /api/quizzes/submit ---');
    console.error(error);
    // A more detailed error response for debugging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}