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
import { useAuth } from "@/context/AuthContext";
import { getAllChargingBays, getChargingBaysByOperatorId } from "@/services/ChargingBayServices";

const STATUS_COLORS = {
  Undefined: "#6B7280",  // Gray
  Available: "#10B981",  // Green
  Occupied: "#EAB308",   // Yellow
  Unavailable: "#EF4444", // Red
  Faulted: "#F97316",     // Orange
};

const STATUS_LABELS = {
  0: "Undefined",
  1: "Available", 
  2: "Occupied",
  3: "Unavailable",
  4: "Faulted"
};

function ChargingBayStatusChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBays, setTotalBays] = useState(0);

  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem("operatorId");
  
  useEffect(() => {
    const fetchChargingBaysData = async () => {
      try {
        setLoading(true);
        let chargingBays = [];
        if (isOperator) {
          // For operators, fetch charging bays by operatorId
          chargingBays = await getChargingBaysByOperatorId(operatorId, token);
        } else {
          chargingBays = await getAllChargingBays(token);
        }
        
        // Count charging bays by status
        const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
        chargingBays.forEach(bay => {
          const status = bay.status !== undefined ? bay.status : 0;
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });
        
        const total = chargingBays.length;
        setTotalBays(total);
        
        const chartData = Object.entries(statusCounts)
          .map(([status, count]) => ({
            name: STATUS_LABELS[status],
            value: count,
            color: STATUS_COLORS[STATUS_LABELS[status]],
            status: parseInt(status),
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
          }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);
        
        setData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChargingBaysData();
    }
  }, [token, isOperator, operatorId]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{dataPoint.payload.name}</p>
          <p className="text-sm text-gray-600">
            {dataPoint.payload.value} bays ({dataPoint.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label rendering function for percentages
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (percentage < 5) return null; // Hide small slices
    
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
      <div className={`col-span-12 ${isOperator ? 'lg:col-span-6' : 'lg:col-span-4'} overflow-hidden rounded border border-stone-300`}>
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Charging Bay Status
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading charging bay data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`col-span-12 ${isOperator ? 'lg:col-span-6' : 'lg:col-span-4'} overflow-hidden rounded border border-stone-300`}>
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Charging Bay Status
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
      <div className={`col-span-12 ${isOperator ? 'lg:col-span-6' : 'lg:col-span-4'} overflow-hidden rounded border border-stone-300`}>
        <div className="px-4 pt-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <BsEvStation /> Charging Bay Status
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No charging bay data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`col-span-12 ${isOperator ? 'lg:col-span-6' : 'lg:col-span-4'} overflow-hidden rounded border border-stone-300 bg-white`}>
      <div className="px-4 pt-4">
        <h3 className="flex items-center gap-1.5 font-medium text-gray-800">
          <BsEvStation /> Charging Bay Status
        </h3>
      </div>

      <div className="px-4 pb-6">
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
        <div className="flex items-center gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-600">
                {entry.name} - {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChargingBayStatusChart;