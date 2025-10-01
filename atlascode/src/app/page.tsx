import CourseCard from "@/components/ui/CourseCard";

const mockCourses = [
  {
    title: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript, the language of the web.",
    language: "JavaScript",
    progress: 60,
  },
  {
    title: "Python for Beginners",
    description: "Start your programming journey with Python's simple syntax.",
    language: "Python",
    progress: 30,
  },
  {
    title: "React Deep Dive",
    description: "Master the world's most popular front-end library.",
    language: "JavaScript",
    progress: 10,
  },
    {
    title: "Advanced TypeScript",
    description: "Explore advanced types, generics, and decorators in TypeScript.",
    language: "TypeScript",
    progress: 0,
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <CourseCard key={course.title} {...course} />
        ))}
      </div>
    </div>
  );
}
