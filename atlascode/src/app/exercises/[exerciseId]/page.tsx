'use client';

import { useState, useEffect, use, useRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import CodeEditor from '@/components/ui/CodeEditor';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: Promise<{ exerciseId: string }>;
};

type Exercise = {
  id: number;
  lesson_id: number;
  question: string;
  starter_code: string | null;
  expected_output: string | null;
  test_cases: {
    input: string;
    expected: string;
  }[];
}

const ExercisePage: NextPage<Props> = ({ params }) => {
  const { exerciseId } = use(params);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      // This should ideally be set on the home page or layout
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

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

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'code_execution_result') {
        const { results } = event.data;
        const allTestsPassed = results.every((r: any) => r.passed);
        setResult(JSON.stringify(results, null, 2));

        // Send results to the backend for persistence and progress update
        try {
          const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              exerciseId: parseInt(exerciseId, 10),
              sessionId,
              testResults: results,
              allTestsPassed,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit results');
          }
          // Optionally, handle success response from submission API
        } catch (error) {
          console.error('Error submitting code results:', error);
          setResult(prev => prev + '\nError submitting results to server.');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [code, exerciseId, sessionId]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleSubmit = () => {
    if (iframeRef.current && exercise) {
      iframeRef.current.contentWindow?.postMessage(
        {
          code,
          testCases: exercise.test_cases || [{ input: '', expected: exercise.expected_output || '' }],
        },
        window.location.origin
      );
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
      <iframe ref={iframeRef} src="/sandbox.html" className="hidden" title="Code Sandbox"></iframe>
      <div className="mb-4">
        <Link href={`/lessons/${exercise.lesson_id}`} className="text-blue-500 hover:underline">
          &larr; レッスンに戻る
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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