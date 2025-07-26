import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export const SignIn = () => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up instead.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(isSignUp ? 'Failed to create account. Please try again.' : 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Pane */}
      <div className="flex-1 bg-gradient-to-br from-green-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center h-full p-8">
          <div className="text-center text-white max-w-md">
            <h1 className="text-5xl font-bold mb-4">TrueConnect</h1>
            <p className="text-xl mb-8 opacity-90">Where every voice is verified</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">✓</span>
                <span className="text-lg">100% verified humans</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">🛡️</span>
                <span className="text-lg">Zero tolerance for bots</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">🌟</span>
                <span className="text-lg">Authentic conversations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Auth Pane */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              {isSignUp ? 'Join TrueConnect' : 'Welcome Back'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {isSignUp ? 'Create your verified account' : 'Sign in to your account'}
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
              {isSignUp && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required={isSignUp}
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              )}
              <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
            </button>
            
            {/* Toggle Sign Up/In */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-500 hover:text-green-600 font-medium text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
