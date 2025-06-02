'use client';

import Login from '@/components/Login/Login';
import { AuthProvider } from '@/context/AuthContext';

export default function LoginPage() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}