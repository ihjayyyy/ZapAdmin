'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest } from '@/services/AuthServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(parsedUser.confirmed);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await loginRequest(email, password);

      const userData = {
        id: data.userId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token: data.token,
        userType: data.userType,
        refreshToken: data.refreshToken,
        confirmed: data.confirmed,
      };

      if (!data.confirmed) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setError("Your account is not verified. We've sent a One-Time Password (OTP) to your email.");
        setIsAuthenticated(false);
        return false;
      }

      if (data.userType === 0 || data.userType === 2) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
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
      if(err == `Unexpected token 'I', "Invalid User." is not valid JSON`){
        setError('Login failed. Check your username and password.')
      }
      setError(err.message || 'An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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