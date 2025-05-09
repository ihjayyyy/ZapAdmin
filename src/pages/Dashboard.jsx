import React, { useState, useEffect } from 'react';
import { ShieldUser, Activity, Fuel, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllOperators } from '../services/OperatorServices';
import { getAllStations, getStationsByOperator } from '../services/StationServices';

function Dashboard() {
  // State for dashboard data
  const [operatorCount, setOperatorCount] = useState(0);
  const [stationCount, setStationCount] = useState(0);
  const [recentOperators, setRecentOperators] = useState([]);
  const [recentStations, setRecentStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the auth token and user role data
  const token = localStorage.getItem('token');
  const userOperatorId = localStorage.getItem('operatorId');
  const isAdmin = !userOperatorId;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch operators data (for admins) or single operator (for operator users)
      let operatorsData = [];
      if (isAdmin) {
        operatorsData = await getAllOperators(token);
        setOperatorCount(operatorsData.length);
        
        // Sort by creation date (assuming there's a createdAt field, adjust as needed)
        const sortedOperators = [...operatorsData].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setRecentOperators(sortedOperators.slice(0, 5)); // Get 5 most recent
      } else {
        // For operator users, we just count as 1
        setOperatorCount(1);
      }
      
      // Fetch stations data
      const stationsData = userOperatorId 
        ? await getStationsByOperator(userOperatorId, token)
        : await getAllStations(token);
      
      setStationCount(stationsData.length);
      
      // Sort by creation date (assuming there's a createdAt field, adjust as needed)
      const sortedStations = [...stationsData].sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setRecentStations(sortedStations.slice(0, 5)); // Get 5 most recent
      
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find operator name by ID for display in station list
  const getOperatorNameById = (operatorId) => {
    const operator = recentOperators.find(op => op.id === operatorId);
    return operator ? operator.name : 'Unknown Operator';
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-deep-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Operators Stats */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    {isAdmin ? 'Total Operators' : 'Your Operator'}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">{operatorCount}</h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShieldUser className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="bg-green-50 px-6 py-2">
                <Link 
                  to="/operators" 
                  className="text-sm text-green-600 hover:text-green-800 flex items-center"
                >
                  View all operators
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Stations Stats */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    {isAdmin ? 'Total Stations' : 'Your Stations'}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">{stationCount}</h2>
                </div>
                <div className="bg-deep-blue-100 p-3 rounded-full">
                  <Fuel className="h-6 w-6 text-deep-blue-900" />
                </div>
              </div>
              <div className="bg-deep-blue-50 bg-opacity-10 px-6 py-2">
                <Link 
                  to="/stations" 
                  className="text-sm text-deep-blue-600 hover:text-deep-blue-800 flex items-center"
                >
                  View all stations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Placeholder for future stats */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">System Status</p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">Active</h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="bg-purple-50 px-6 py-2">
                <span className="text-sm text-purple-600">All systems operational</span>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Operators - Only show for admin */}
            {isAdmin && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <ShieldUser className="h-5 w-5 mr-2 text-green-500" />
                    Recent Operators
                  </h3>
                  <Link 
                    to="/operators" 
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentOperators.length > 0 ? (
                    recentOperators.map(operator => (
                      <div key={operator.id} className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <ShieldUser size={18} className="text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{operator.name}</p>
                            <p className="text-sm text-gray-500">{operator.email}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-gray-500">
                      No operators found
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Recent Stations */}
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${!isAdmin ? 'lg:col-span-2' : ''}`}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <Fuel className="h-5 w-5 mr-2 text-deep-blue-900" />
                  Recent Stations
                </h3>
                <Link 
                  to="/stations" 
                  className="text-sm text-deep-blue-900 hover:text-deep-blue-700"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {recentStations.length > 0 ? (
                  recentStations.map(station => (
                    <div key={station.id} className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-deep-blue-100 rounded-full flex items-center justify-center">
                          <Fuel size={18} className="text-deep-blue-900" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{station.name}</p>
                          <div className="flex mt-1">
                            <p className="text-xs text-gray-500 mr-4">{station.address}</p>
                            {isAdmin && (
                              <p className="text-xs text-green-600">{getOperatorNameById(station.operatorId)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No stations found
                  </div>
                )}
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}

export default Dashboard;