import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import Settings from '../../pages/Settings.Jsx';
import Help from '../../pages/Help';
import Login from '../../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import Otp from '../../pages/Otp';
import Stations from '../../pages/Stations/Stations';
import Operators from '../../pages/Operator/Operator';
import ChargingBay from '../../pages/ChargingBay/ChargingBay';
import Connector from '../../pages/Connectors/Connector';

const Layout = () => {
  const [expanded, setExpanded] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Render login page without sidebar if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Render normal layout with sidebar when authenticated
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      
      <main className={`flex-1 transition-all duration-300 ${
        expanded ? "ml-60" : "ml-17"
      }`}>
        <div className="py-8 px-8 h-full">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/stations" element={<Stations />} />
              <Route path="/operators" element={<Operators />} />
              <Route path="/bays" element={<ChargingBay />} />
              <Route path="/connector" element={<Connector />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/otp" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Layout;
