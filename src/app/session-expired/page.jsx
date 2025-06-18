'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';

export default function SessionExpired() {
  const router = useRouter();

  useEffect(() => {
    // Clear any lingering authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('refreshToken');
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <FiAlertTriangle className="text-red-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h1>
          <p className="text-gray-600 mb-6">
            Your session has expired due to inactivity or was terminated for security reasons. 
            Please log in again to continue.
          </p>
          <button
            onClick={handleLogin}
            className="bg-deepblue-500 hover:bg-deepblue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}