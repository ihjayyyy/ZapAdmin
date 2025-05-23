'use client';

import React from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopBar from "@/components/TopBar";
const SidebarLayout = ({ children }) => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="w-full">
        <div className='bg-white rounded-lg pb-4 shadow min-h-[calc(100vh-32px)]'>
            <TopBar></TopBar>
          {children}
        </div>
      </div>
    </main>
  );
};

export default SidebarLayout;
