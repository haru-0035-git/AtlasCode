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
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200 flex-shrink-0">
      <h2 className="text-lg font-bold mb-4 text-gray-800">{courseTitle}</h2>
      <nav>
        <ul className="border-t border-gray-300">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="border-b border-gray-300">
              <Link href={`/lessons/${lesson.id}`} className="block p-3 text-gray-700 hover:bg-gray-200 transition-colors">
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
