'use client';

import CodeEditor from '@/components/ui/CodeEditor';
import { FC, useState, useRef, useEffect } from 'react';

type ExercisePageProps = {
  params: {
    exerciseId: string;
  };
};

const ExercisePage: FC<ExercisePageProps> = ({ params }) => {
  const exerciseId = params.exerciseId;
  const starterCode = `// Solve the exercise here\nconsole.log('Hello from Exercise ${exerciseId}');`;

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string[]>(['// Output will be shown here']);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleRunCode = () => {
    if (iframeRef.current) {
      setOutput(['// Running code...']);
      iframeRef.current.contentWindow?.postMessage(code, '*');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic security check
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }
      setOutput(prev => [...prev, ...event.data]);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="p-4 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold">Exercise {exerciseId}: Variables</h1>
        <p className="mt-2 text-gray-700">Declare a variable named `myVar` and assign it the value `42`.</p>
      </div>
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-full">
          <CodeEditor value={code} onChange={handleCodeChange} />
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col">
          <div className="p-4">
            <button 
              onClick={handleRunCode}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Run Code
            </button>
          </div>
          <div className="flex-grow bg-gray-900 text-white p-4 font-mono text-sm overflow-auto">
            {output.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="/sandbox.html"
        className="hidden"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default ExercisePage;
