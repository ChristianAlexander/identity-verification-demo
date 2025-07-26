import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export const NavBar = () => {
  const { user, userDoc, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Show minimal nav for vulnerability demo page even when not signed in
  if (!user && location.pathname !== '/vulnerability') {
    return null;
  }

  if (location.pathname === '/signin') {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link 
              to="/vulnerability" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                location.pathname === '/vulnerability' 
                  ? 'border-b-2 border-red-500 text-red-600 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              🚨 Security Demo
            </Link>
            {user && (
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                My Profile
              </Link>
            )}
            {user && isAdmin && (
              <Link 
                to="/admin" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/admin' 
                    ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.displayName || userDoc?.displayName}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
