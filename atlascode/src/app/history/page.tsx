'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface Submission {
  id: number;
  code: string;
  result: string;
  created_at: string;
  exercise: {
    id: number;
    question: string;
    lesson: {
      id: number;
      title: string;
      course: {
        id: number;
        title: string;
      };
    };
  };
}

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/submissions/history?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission history');
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [sessionId]);

  if (isLoading) {
    return <div className="container mx-auto p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">学習履歴</h1>
      {submissions.length === 0 ? (
        <p>まだ提出されたコードはありません。</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/exercises/${submission.exercise.id}`} className="text-blue-600 hover:underline">
                  {submission.exercise.lesson.course.title} - {submission.exercise.lesson.title} - {submission.exercise.question}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm mb-4">提出日時: {new Date(submission.created_at).toLocaleString()}</p>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">提出コード:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
                  <code>{submission.code}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">実行結果:</h3>
                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
                  <code>{JSON.stringify(JSON.parse(submission.result), null, 2)}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
