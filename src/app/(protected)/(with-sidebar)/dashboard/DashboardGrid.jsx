import React from "react";
import StatCards from "./StatCards";
import RecentTransactions from "./RecentTransactions";
import UserTypesRadar from "./UserTypesRadar";
import StationsPieChart from "./StationPieChart";
import ChargingBayStatusChart from "./ChargingBayStatusChart";

function DashboardGrid() {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <StationsPieChart />
      <ChargingBayStatusChart />
      <UserTypesRadar />
      {/* <RecentTransactions /> */}
    </div>
  );
}

export default DashboardGrid;
