'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface QuizQuestion {
  id: number;
  text: string;
  type: 'multiple_choice' | 'fill_in_the_blank';
  options: string[];
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

interface QuizSubmissionResult {
  questionId: number;
  isCorrect: boolean;
  correctAnswer: string[];
  userAnswer: string[];
}

interface QuizResult {
  quizId: number;
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  results: QuizSubmissionResult[];
}

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
  const [submissionResult, setSubmissionResult] = useState<QuizResult | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate a simple session ID for anonymous users
    if (!sessionId) {
      setSessionId(localStorage.getItem('sessionId') || `anon-${Date.now()}`);
      localStorage.setItem('sessionId', sessionId);
    }

    if (quizId) {
      fetch(`/api/quizzes/${quizId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setQuiz(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [quizId, sessionId]);

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [selectedOption], // Assuming single choice for now
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setLoading(true);
    setError(null);

    const answersPayload = Object.entries(userAnswers).map(([questionId, selectedOptions]) => ({
      questionId: parseInt(questionId, 10),
      selectedOptions: selectedOptions,
    }));

    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          sessionId: sessionId,
          answers: answersPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data: QuizResult = await res.json();
      setSubmissionResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading quiz...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="container mx-auto p-4">Quiz not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      {quiz.description && <p className="text-lg mb-6">{quiz.description}</p>}

      {!submissionResult ? (
        <div>
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 border rounded-lg shadow-sm">
              <p className="text-xl font-semibold mb-3">{index + 1}. {question.text}</p>
              {
                question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={userAnswers[question.id]?.[0] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                          className="form-radio text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )
              }
              {
                question.type === 'fill_in_the_blank' && (
                  <input
                    type="text"
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={userAnswers[question.id]?.[0] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Your answer"
                  />
                )
              }
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? '送信中...' : '送信'}
          </button>
        </div>
      ) : (
        <div className="mt-8 p-6 border rounded-lg shadow-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p className="text-xl mb-2">Score: {submissionResult.score.toFixed(2)}%</p>
          <p className="text-lg mb-4">Correct Answers: {submissionResult.correctAnswers} / {submissionResult.totalQuestions}</p>
          <div className="space-y-4">
            {submissionResult.results.map((result) => (
              <div key={result.questionId} className="p-3 border rounded-md bg-white">
                <p className="font-semibold">Question ID: {result.questionId}</p>
                <p className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  Your Answer: {result.userAnswer.join(', ')} {result.isCorrect ? '(Correct)' : '(Incorrect)'}
                </p>
                {!result.isCorrect && (
                  <p className="text-gray-600">Correct Answer: {result.correctAnswer.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}