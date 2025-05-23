"use client";

import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getAllUsers } from "@/services/UserServices";

const USER_TYPE_MAP = {
  0: "Admin",
  1: "Customer",
  2: "Operator",
};

const COLORS = {
  Operator: "#18181b",
  Admin: "#232F68",
  Customer: "#dc2626",
};

function UserTypesChart() {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Or however you store it
        const users = await getAllUsers(token);

        const grouped = users.reduce((acc, user) => {
          // Map numeric userType to string
          const type =
            USER_TYPE_MAP[user.userType] || "Unknown";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([type, count]) => ({
          userType: type,
          count,
          color: COLORS[type] || "#6b7280", // fallback gray
        }));

        setChartData(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="col-span-12 lg:col-span-4 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiUsers /> Users
        </h3>
      </div>

      <div className="h-64 pb-4">
        {error ? (
          <div className="text-center text-red-600 text-sm">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="userType" 
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                wrapperStyle={{ fontSize: "0.875rem" }}
                labelStyle={{ color: "#78716c", fontSize: "0.75rem" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default UserTypesChart;
