import React from "react";
import StatCards from "./StatCards";
import UserTypesRadar from "./UserTypesRadar";
import StationsPieChart from "./StationPieChart";
import ChargingBayStatusChart from "./ChargingBayStatusChart";
import { ChargingSessionGraph } from "./ChargingSessiongGraph";

function DashboardGrid() {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <ChargingSessionGraph/>
      <StationsPieChart />
      <ChargingBayStatusChart />
      <UserTypesRadar />
      {/* <RecentTransactions /> */}
    </div>
  );
}

export default DashboardGrid;
