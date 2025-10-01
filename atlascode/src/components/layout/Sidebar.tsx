import Link from 'next/link';

const mockLessons = [
  { id: '1', title: 'Introduction to Variables' },
  { id: '2', title: 'Data Types' },
  { id: '3', title: 'Functions and Scope' },
  { id: '4', title: 'Arrays and Objects' },
  { id: '5', title: 'DOM Manipulation' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200">
      <h2 className="text-lg font-bold mb-4">Course Lessons</h2>
      <nav>
        <ul>
          {mockLessons.map((lesson) => (
            <li key={lesson.id} className="mb-2">
              <Link href={`/lessons/${lesson.id}`} className="text-gray-700 hover:text-blue-600 transition-colors">
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
