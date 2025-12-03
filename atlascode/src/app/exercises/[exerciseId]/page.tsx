'use client';

import { useState, useEffect, use, useRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import CodeEditor from '@/components/ui/CodeEditor';
import { v4 as uuidv4 } from 'uuid';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { useParams } from 'next/navigation';

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
};

const ExercisePage = () => {
  const params = useParams();
  const exerciseId = params.exerciseId as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!exerciseId) return;
    const fetchExercise = async () => {
      setIsLoading(true);
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
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'code_execution_result') {
        const { results } = event.data;
        const allTestsPassed = results.every((r: any) => r.passed);
        setResult(JSON.stringify(results, null, 2));

        try {
          const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        } catch (error) {
          console.error('Error submitting code results:', error);
          setResult(prev => prev + '\nError submitting results to server.');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  if (!exercise) {
    return <div className="flex items-center justify-center h-full">演習が見つかりません。</div>;
  }

  return (
    <>
      <iframe ref={iframeRef} src="/sandbox.html" className="hidden" title="Code Sandbox"></iframe>
      <div className="flex-grow h-full">
        <Allotment defaultSizes={[30, 70]} sashClassName="sash-style" className="h-full">
          <Allotment.Pane minSize={300}>
            <div className="h-full overflow-auto">
              <h1 className="text-2xl font-bold mb-4 p-4">{exercise.question}</h1>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <Allotment vertical sashClassName="sash-style">
              <Allotment.Pane>
                <CodeEditor value={code} onChange={handleCodeChange} />
              </Allotment.Pane>
              <Allotment.Pane>
                <div className="h-full flex flex-col">
                  <div className="p-2 border-b border-t flex justify-between items-center">
                    <h2 className="text-xl font-semibold">結果</h2>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      実行
                    </button>
                  </div>
                  <div className="bg-foreground/5 text-foreground flex-grow p-4 overflow-auto">
                    {result && JSON.parse(result).map((testResult: any, index: number) => (
                      <div key={index} className="mb-4 p-2 border rounded-md">
                        <p className="font-semibold">テスト {index + 1}:</p>
                        <p>入力: <span className="font-mono">{testResult.input === '' ? '(なし)' : testResult.input}</span></p>
                        <p>期待値: <span className="font-mono">{testResult.expected === '' ? '(なし)' : testResult.expected}</span></p>
                        <p>実際の結果: <span className="font-mono">{testResult.actual === '' ? '(なし)' : testResult.actual}</span></p>
                        {testResult.error && <p className="text-red-500">エラー: {testResult.error}</p>}
                        <p className={testResult.passed ? 'text-green-500' : 'text-red-500'}>
                          ステータス: {testResult.passed ? '合格' : '不合格'}
                        </p>
                      </div>
                    ))}
                    {!result && <p>コードを実行してください。</p>}
                  </div>
                </div>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
};

export default ExercisePage;