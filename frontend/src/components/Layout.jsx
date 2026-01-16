import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `px-4 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                👨‍👩‍👧‍👦 FamilyApp
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link to="/" className={navLinkClass('/')}>
                  Dashboard
                </Link>
                <Link to="/calendar" className={navLinkClass('/calendar')}>
                  Agenda
                </Link>
                <Link to="/shopping" className={navLinkClass('/shopping')}>
                  Boodschappen
                </Link>
                <Link to="/chat" className={navLinkClass('/chat')}>
                  AI Chat
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-gray-700">Hallo, {user.name}!</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Uitloggen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
