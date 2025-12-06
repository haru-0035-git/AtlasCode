import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 dark:bg-blue-800">
      <div className="w-full flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AtlasCode
        </Link>
      </div>
    </header>
  );
};

export default Header;
