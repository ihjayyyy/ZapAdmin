'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loginRequest, refreshTokenRequest } from '@/services/AuthServices';
import { getUserOperatorsByUser } from '@/services/UserOperatorServices';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Track which alerts have been shown
  const [alerted, setAlerted] = useState({});

  // Helper: show alert only once per time
  const showAlert = (minutes) => {
    if (!alerted[minutes]) {
      toast.warn(
        minutes === 0.5
          ? 'Token will expire in 30 seconds. You will be logged out soon.'
          : `Token will expire in ${minutes === 0.5 ? '30 seconds' : `${minutes} minute${minutes > 1 ? 's' : ''}`}.`,
        { toastId: `token-expiry-${minutes}` }
      );
      setAlerted((prev) => ({ ...prev, [minutes]: true }));
    }
  };

  // Helper: show refresh option
  const showRefreshOption = (onRefresh) => {
    toast.info(
      <div>
        <div>Your session is about to expire. <b>Refresh token?</b></div>
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
          onClick={onRefresh}
        >
          Refresh Token
        </button>
      </div>,
      { toastId: 'refresh-token-option', autoClose: false }
    );
  };

  // Token expiry check effect
  useEffect(() => {
    const checkExpiry = () => {
      const expiryStr = localStorage.getItem('tokenExpirationDate');
      if (!expiryStr) return;
      
      const expiry = new Date(expiryStr);
      const now = new Date();
      const diffMs = expiry - now;
      const diffMin = diffMs / 60000;

      // Only show alerts if not already shown for this threshold
      [30, 20, 10, 5, 1].forEach((min) => {
        if (diffMin <= min && diffMin > min - 0.5 && !alerted[`alert${min}`]) {
          showAlert(min);
          setAlerted(prev => ({...prev, [`alert${min}`]: true}));
        }
      });

      // Show refresh option at 1 minute (only once)
      if (diffMin <= 1 && diffMin > 0.5 && !alerted['refresh']) {
        showRefreshOption(handleRefreshToken);
        setAlerted(prev => ({...prev, refresh: true}));
      }

      // Schedule logout at 30 seconds remaining (but don't execute immediately)
      if (diffMin <= 0.5 && diffMin > 0 && !alerted['logoutScheduled']) {
        setAlerted(prev => ({...prev, logoutScheduled: true}));
        
        // Set timeout to logout after the remaining time
        const remainingMs = Math.max(diffMs, 0);
        setTimeout(() => {
          logout(true);
          toast.error('Session expired. You have been logged out.');
        }, remainingMs);
      }

      // Immediate logout only if actually expired
      if (diffMin <= 0 && !alerted['expired']) {
        setAlerted(prev => ({...prev, expired: true}));
        logout(true);
        toast.error('Session expired. You have been logged out.');
      }
    };

    const interval = setInterval(checkExpiry, 10000); // Check every 10 seconds
    
    // Run once on mount
    checkExpiry();
    
    return () => clearInterval(interval);
  }, [alerted, router]);

  // Refresh token handler
  const handleRefreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const data = await refreshTokenRequest(token, refreshToken);
      // Update tokens and expiry
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpirationDate', data.tokenExpirationDate);
      setAlerted({});
      toast.success('Token refreshed!');
      // Optionally update user state if needed
    } catch (err) {
      toast.error('Failed to refresh token. Please login again.');
      logout(true); // Pass true to indicate expired session
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const expiry = localStorage.getItem('tokenExpirationDate');
      console.log(expiry, new Date(), new Date(expiry));
      if (expiry && new Date() > new Date(expiry)) {
        logout();
        return;
      }
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(parsedUser.confirmed);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Set up interval to check expiry every minute
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('tokenExpirationDate');
      if (expiry && new Date() > new Date(expiry)) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await loginRequest(email, password);

      // Build base userData
      const userData = {
        id: data.userId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token: data.token,
        userType: data.userType,
        refreshToken: data.refreshToken,
        tokenExpirationDate: data.tokenExpirationDate,
        confirmed: data.confirmed,
      };
      localStorage.setItem('tokenExpirationDate', data.tokenExpirationDate);

      if (!data.confirmed) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setError("Your account is not verified. We've sent a One-Time Password (OTP) to your email.");
        setIsAuthenticated(false);
        return false;
      }

      if (data.userType === 0 || data.userType === 2) {
        // Store tokens and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);

        // If the user is an Operator, fetch operatorId from UserOperatorServices
        if (data.userType === 2) {
          const userOperators = await getUserOperatorsByUser(data.userId, data.token);
          if (userOperators && userOperators.length > 0) {
            const operatorId = userOperators[0].operatorId; // assuming you use the first record
            localStorage.setItem('operatorId', operatorId);
            userData.operatorId = operatorId;
          }
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      } else {
        setError('User type not authorized. Only Admin and Operator accounts can access this system.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === "Unexpected token 'I', \"Invalid User.\" is not valid JSON") {
        setError('Login failed. Check your username and password.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (expired = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('operatorId');
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to session-expired page if token was expired
    if (expired) {
      router.push('/session-expired');
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;