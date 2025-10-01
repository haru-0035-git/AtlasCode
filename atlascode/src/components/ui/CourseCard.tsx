import { FC } from 'react';

type CourseCardProps = {
  title: string;
  description: string;
  language: string;
  progress: number;
};

const CourseCard: FC<CourseCardProps> = ({ title, description, language, progress }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            {language}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">Progress</span>
            <span className="text-sm font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
