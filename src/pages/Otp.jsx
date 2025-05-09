import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { validateAccount,resendOTP } from '../services/authServices';

function Otp() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const id = user?.id;
      if (!id) {
        throw new Error('User information not found. Please try logging in again.');
      }

      const response = await validateAccount(id, otp);
      setSuccess(true);
      localStorage.setItem('token', response.token);
      window.location.href = '/dashboard';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60);

    try {
      const id = user?.id;
      if (!id) {
        throw new Error('User information not found');
      }

      await resendOTP(id);
      setError('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img className="h-20 w-auto" src="/zap-logo.svg" alt="Logo" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Verify Your Account</h2>
          <p className="mt-1 text-sm text-gray-400">Enter the 6-digit code sent to {user?.email}</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            Account verified successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                One Time Password (OTP)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(value);
                  }}
                  className="pl-10 input"
                  placeholder="Enter your 6-digit OTP"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={resendDisabled}
                onClick={handleResendOTP}
                className="cursor-pointer inline-flex items-center text-sm text-turquoise-500 hover:text-turquoise-600 disabled:text-gray-400"
              >
                <RefreshCw size={16} className="mr-1" />
                {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full filled-button"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Otp;
