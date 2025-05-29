"use client";

import React, { useState, useEffect } from "react";
import { BsEvStation } from "react-icons/bs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getAllStations } from "@/services/StationServices";

const COLORS = {
  Active: "#10B981", // Green
  Inactive: "#EF4444", // Red
};

function StationsPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStations, setTotalStations] = useState(0);

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchStationsData = async () => {
      try {
        setLoading(true);
        const stations = await getAllStations(token);
        
        // Count active and inactive stations
        const activeCount = stations.filter(station => station.active === true).length;
        const inactiveCount = stations.filter(station => station.active === false).length;
        
        const total = stations.length;
        setTotalStations(total);
        
        const chartData = [
          {
            name: "Active",
            value: activeCount,
            color: COLORS.Active,
            percentage: total > 0 ? Math.round((activeCount / total) * 100) : 0
          },
          {
            name: "Inactive", 
            value: inactiveCount,
            color: COLORS.Inactive,
            percentage: total > 0 ? Math.round((inactiveCount / total) * 100) : 0
          },
        ]
        .filter(item => item.value > 0) // Only show categories with data
        .sort((a, b) => b.value - a.value); // Sort by value descending
        
        setData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStationsData();
    }
  }, [token]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            {data.payload.value} stations ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label rendering function for percentages on the chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (percentage < 5) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="col-span-12 lg:col-span-4 overflow-hidden rounded border border-stone-300">
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Stations Status
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading stations data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-4 overflow-hidden rounded border border-stone-300">
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Stations Status
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="col-span-12 lg:col-span-4 overflow-hidden rounded border border-stone-300">
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Stations Status
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No stations data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-4 overflow-hidden rounded border border-stone-300 bg-white">
      <div className="px-4 pt-4">
        <h3 className="flex items-center gap-1.5 font-medium text-gray-800">
          <BsEvStation /> Stations Status
        </h3>
      </div>

      <div className="px-4 pb-6">
        {/* Donut Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#ffffff"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with counts */}
        <div className="flex items-center gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-600">
                  {entry.name} - {entry.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StationsPieChart;