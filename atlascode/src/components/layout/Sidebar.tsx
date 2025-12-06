import Link from 'next/link';

// Define the type for a single lesson
interface Lesson {
  id: number;
  title: string;
}

// Define the props for the Sidebar component
interface SidebarProps {
  lessons: Lesson[];
  courseTitle: string;
}

const Sidebar: React.FC<SidebarProps> = ({ lessons, courseTitle }) => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200 flex-shrink-0 dark:bg-slate-900 dark:text-white">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{courseTitle}</h2>
      <nav>
        <ul className="border-t border-gray-300 dark:border-gray-700">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="border-b border-gray-300 dark:border-gray-700">
              <Link href={`/lessons/${lesson.id}`} className="block p-3 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
