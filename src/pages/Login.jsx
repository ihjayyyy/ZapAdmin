import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showUserTypeMessage, setShowUserTypeMessage] = useState(false);
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      if (authError.includes('User type not authorized')) {
        setShowUserTypeMessage(true);
      } else if (authError.includes('Your account is not verified.')) {
        navigate('/otp');
      } else {
        setLocalError(authError);
      }
    }
  }, [authError]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setShowUserTypeMessage(false);

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setLocalError(`Login failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  const displayError = localError || (authError && !showUserTypeMessage ? authError : '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img className="h-20 w-auto" src="/zap-logo.svg" alt="Logo" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-400">Please sign in to your account</p>
        </div>

        {displayError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{displayError}</span>
          </div>
        )}

        {showUserTypeMessage && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">
              Only Admin and Operator accounts can access this system.
            </span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="cursor-pointer h-4 w-4 text-deep-blue-500 focus:ring-deep-blue-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-deep-blue-500 hover:text-deep-blue-400">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="w-full filled-button">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
