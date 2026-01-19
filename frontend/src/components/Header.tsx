import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
          PickLab
        </Link>
      </div>
    </header>
  );
}
