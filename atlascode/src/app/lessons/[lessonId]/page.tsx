import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import { FC } from 'react';

type LessonPageProps = {
  params: {
    lessonId: string;
  };
};

const LessonPage: FC<LessonPageProps> = ({ params }) => {
  const lessonId = params.lessonId;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Lesson {lessonId}: Introduction to Variables</h1>
        <div className="prose lg:prose-xl max-w-none">
          <p>
            Welcome to your first lesson! In programming, a variable is a container for a value. Think of it like a labeled box where you can store information. You can give a variable a name and assign it a value.
          </p>
          <p>For example, in JavaScript, you can declare a variable like this:</p>
          <pre><code>let myVariable = 'Hello, World!';</code></pre>
          <p>
            You can then use the variable name <code>myVariable</code> to refer to its value.
          </p>
        </div>
        <div className="mt-8">
            <Link href={`/exercises/${lessonId}`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Go to Exercise
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
