'use client';

import React from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopBar from "@/components/TopBar";
// SidebarLayout is a layout component used for protected routes in the app.
// It provides a consistent UI with a sidebar for navigation and a top bar for user/account actions.
// Usage: Wrap protected pages/components with SidebarLayout to ensure they have the app's main navigation and header.
// The `children` prop represents the page content rendered inside the layout.
const SidebarLayout = ({ children }) => {
  // The main grid divides the layout into two columns: sidebar and main content.
  return (
    <main className="grid gap-4 p-4 grid-cols-[auto_1fr]">
      {/* Sidebar: Contains navigation links and user/account info */}
      <Sidebar />
      <div className="w-full">
        <div className='bg-white rounded-lg pb-4 shadow min-h-[calc(100vh-32px)]'>
            {/* TopBar: Displays page title, user info, and actions */}
            <TopBar></TopBar>
          {/* Render the page's content here */}
          {children}
        </div>
      </div>
    </main>
  );
};

// Export the layout for use in protected route groups (e.g., /app/(protected)/(with-sidebar)/)
export default SidebarLayout;
