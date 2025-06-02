'use client';

import Otp from '@/components/Otp/Otp';
import { AuthProvider } from '@/context/AuthContext';

export default function OTPPage() {
  return (
    <AuthProvider>
      <Otp/>
    </AuthProvider>
  );
}