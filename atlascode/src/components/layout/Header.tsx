import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="w-full flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AtlasCode
        </Link>
      </div>
    </header>
  );
};

export default Header;
