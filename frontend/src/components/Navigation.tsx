import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 홈', active: location.pathname === '/' },
    { path: '/eat', label: '🍔 음식', active: location.pathname === '/eat' },
    { path: '/game', label: '🎮 게임', active: location.pathname === '/game' },
    { path: '/test', label: '📝 테스트', active: location.pathname === '/test' },
    { path: '/admin', label: '🔧 관리자', active: location.pathname === '/admin' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                item.active
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
