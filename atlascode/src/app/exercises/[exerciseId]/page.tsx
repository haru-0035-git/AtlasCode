'use client';

import { useState, useEffect, use } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import CodeEditor from '@/components/ui/CodeEditor';

type Props = {
  params: Promise<{ exerciseId: string }>;
};

type Exercise = {
  id: number;
  lesson_id: number;
  question: string;
  starter_code: string | null;
}

const ExercisePage: NextPage<Props> = ({ params }) => {
  const { exerciseId } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${exerciseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch exercise');
        }
        const data = await response.json();
        setExercise(data);
        setCode(data.starter_code || '');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, exerciseId }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error submitting code:', error);
      setResult('コードの実行中にエラーが発生しました。');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">読み込み中...</div>;
  }

  if (!exercise) {
    return <div className="container mx-auto p-4">演習が見つかりません。</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href={`/lessons/${exercise.lesson_id}`} className="text-blue-500 hover:underline">
          &larr; レッスンに戻る
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">{exercise.question}</h1>
          <div className="h-[400px] border rounded-md">
            <CodeEditor value={code} onChange={handleCodeChange} />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            実行
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">結果</h2>
          <pre className="bg-gray-800 text-white p-4 rounded-md h-[500px] overflow-auto">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;