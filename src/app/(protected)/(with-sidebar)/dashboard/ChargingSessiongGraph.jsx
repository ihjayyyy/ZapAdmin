"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { getPagedCharging } from "@/services/ChargingSessions";
import { useAuth } from "@/context/AuthContext";

export const ChargingSessionGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');
  
  // Date state for calendar inputs
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  
  const [dateTo, setDateTo] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  const processChargingSessionsForGraph = (sessions) => {
    // Group sessions by month and status
    const monthlyData = {};
    
    sessions.forEach(session => {
      const date = new Date(session.chargingStart);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: monthKey,
          Available: 0,
          Preparing: 0,
          Charging: 0,
          SuspendedEVSE: 0,
          SuspendedEV: 0,
          Finishing: 0,
          Reserved: 0,
          Unavailable: 0,
          Faulted: 0,
          Completed: 0
        };
      }
      
      // Map chargingStatus numbers to correct enum labels
      switch(session.chargingStatus) {
        case 0:
          monthlyData[monthKey].Available++;
          break;
        case 1:
          monthlyData[monthKey].Preparing++;
          break;
        case 2:
          monthlyData[monthKey].Charging++;
          break;
        case 3:
          monthlyData[monthKey].SuspendedEVSE++;
          break;
        case 4:
          monthlyData[monthKey].SuspendedEV++;
          break;
        case 5:
          monthlyData[monthKey].Finishing++;
          break;
        case 6:
          monthlyData[monthKey].Reserved++;
          break;
        case 7:
          monthlyData[monthKey].Unavailable++;
          break;
        case 8:
          monthlyData[monthKey].Faulted++;
          break;
        case 9:
          monthlyData[monthKey].Completed++;
          break;
        default:
          break;
      }
    });
    
    // Convert to array and sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = Object.values(monthlyData).sort((a, b) => {
      return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name);
    });
    
    return result;
  };

  const fetchChargingData = async (startDateStr, endDateStr) => {
    try {
      setLoading(true);
      
      const pagingData = {
        filter: [
          `dateFrom=${startDateStr}`,
          `dateTo=${endDateStr}`
        ],
        page: 1,
        pagesize: 10000, // Large number to get all records in range
        sortField: "ChargingStart",
        sortAscending: true
      };
      
      // If the user is an operator, add a filter for operatorId.
      if (isOperator && operatorId) {
        pagingData.filter.push(`operatorId=${operatorId}`);
      }
      
      const response = await getPagedCharging(pagingData, token);
      const processedData = processChargingSessionsForGraph(response.result);
      
      setData(processedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchChargingData(dateFrom, dateTo);
  }, []);

  // Handle date changes
  const handleDateFromChange = (e) => {
    const newDateFrom = e.target.value;
    setDateFrom(newDateFrom);
    fetchChargingData(newDateFrom, dateTo);
  };

  const handleDateToChange = (e) => {
    const newDateTo = e.target.value;
    setDateTo(newDateTo);
    fetchChargingData(dateFrom, newDateTo);
  };

  // Quick date range buttons
  const setQuickRange = (months) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    setDateFrom(startDateStr);
    setDateTo(endDateStr);
    fetchChargingData(startDateStr, endDateStr);
  };

  if (loading) {
    return (
      <div className="col-span-12 overflow-hidden rounded border border-stone-300">
        <div className="p-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiUser /> Charging Sessions Activity
          </h3>
        </div>
        <div className="h-64 px-4 flex items-center justify-center">
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 overflow-hidden rounded border border-stone-300">
        <div className="p-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiUser /> Charging Sessions Activity
          </h3>
        </div>
        <div className="h-64 px-4 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 overflow-hidden rounded border border-stone-300">
        <div className="p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <h3 className="flex items-center gap-1.5 font-medium">
                <FiUser /> Charging Sessions Activity
            </h3>
            
            {/* Date Range Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
                {/* Quick Range Buttons */}
                <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setQuickRange(1)}
                    className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                >
                    Last Month
                </button>
                <button
                    onClick={() => setQuickRange(3)}
                    className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                >
                    Last 3 Months
                </button>
                <button
                    onClick={() => setQuickRange(6)}
                    className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                >
                    Last 6 Months
                </button>
                </div>
                
                {/* Custom Date Inputs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-1">
                    <FiCalendar className="text-stone-500" size={14} />
                    <label className="text-xs text-stone-600">From:</label>
                    <input
                    type="date"
                    value={dateFrom}
                    onChange={handleDateFromChange}
                    className="px-2 py-1 text-xs border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div className="flex items-center gap-1">
                    <label className="text-xs text-stone-600">To:</label>
                    <input
                    type="date"
                    value={dateTo}
                    onChange={handleDateToChange}
                    min={dateFrom}
                    className="px-2 py-1 text-xs border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="h-64 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={400}
                data={data}
                margin={{
                top: 0,
                right: 0,
                left: -24,
                bottom: 0,
                }}
            >
                <CartesianGrid stroke="#e4e4e7" />
                <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs font-bold"
                padding={{ right: 4 }}
                />
                <YAxis
                className="text-xs font-bold"
                axisLine={false}
                tickLine={false}
                />
                <Tooltip
                wrapperClassName="text-sm rounded"
                labelClassName="text-xs text-stone-500"
                />
                {/* Most important statuses with distinct colors */}
                <Line
                type="monotone"
                dataKey="Charging"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                />
                <Line
                type="monotone"
                dataKey="Completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                />
                <Line
                type="monotone"
                dataKey="Available"
                stroke="#6b7280"
                strokeWidth={1.5}
                dot={{ r: 3 }}
                />
                <Line
                type="monotone"
                dataKey="Preparing"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={{ r: 3 }}
                />
                <Line
                type="monotone"
                dataKey="Finishing"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                dot={{ r: 3 }}
                />
                <Line
                type="monotone"
                dataKey="Reserved"
                stroke="#06b6d4"
                strokeWidth={1.5}
                dot={{ r: 3 }}
                />
                <Line
                type="monotone"
                dataKey="Faulted"
                stroke="#ef4444"
                strokeWidth={1.5}
                dot={{ r: 3 }}
                />
                <Line
                type="monotone"
                dataKey="Unavailable"
                stroke="#9ca3af"
                strokeWidth={1}
                dot={{ r: 2 }}
                />
                <Line
                type="monotone"
                dataKey="SuspendedEVSE"
                stroke="#f97316"
                strokeWidth={1}
                dot={{ r: 2 }}
                />
                <Line
                type="monotone"
                dataKey="SuspendedEV"
                stroke="#eab308"
                strokeWidth={1}
                dot={{ r: 2 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
  );
};