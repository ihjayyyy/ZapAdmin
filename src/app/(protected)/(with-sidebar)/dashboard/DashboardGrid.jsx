'use client';

import React from "react";
import StatCards from "./StatCards";
import UserTypesRadar from "./UserTypesRadar";
import StationsPieChart from "./StationPieChart";
import ChargingBayStatusChart from "./ChargingBayStatusChart";
import { ChargingSessionGraph } from "./ChargingSessiongGraph";
import { useAuth } from "@/context/AuthContext";

function DashboardGrid() {
    const { user } = useAuth();
    const isOperator = user?.userType === 2;
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <ChargingSessionGraph/>
      <StationsPieChart />
      <ChargingBayStatusChart />
      {!isOperator && (<UserTypesRadar />)}
    </div>
  );
}

export default DashboardGrid;
