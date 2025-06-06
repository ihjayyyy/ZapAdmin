'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiHome, FiUser, FiUsers } from 'react-icons/fi';
import { RiShieldUserLine } from 'react-icons/ri';
import { BsBattery, BsEvStation } from "react-icons/bs";
import { MdOutlineElectricCar } from "react-icons/md";
import { PiPlugChargingBold } from "react-icons/pi";
import { PiUserList } from "react-icons/pi";

const Route = ({ Icon, title, collapsed, href }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [buttonRef, setButtonRef] = useState(null);

  const selected = pathname === href;

  const handleClick = () => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <div className="relative">
      <button
        ref={setButtonRef}
        onClick={handleClick}
        onMouseEnter={() => { collapsed && setShowTooltip(true); }}
        onMouseLeave={() => { setShowTooltip(false); }}
        className={`cursor-pointer flex items-center ${
          collapsed ? 'justify-center w-auto' : 'justify-start w-full'
        } gap-2 rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
          selected
            ? 'bg-deepblue-500 text-white shadow'
            : 'hover:bg-stone-200 bg-transparent text-stone-500 shadow-none'
        }`}
      >
        <Icon size={22} className={selected ? 'text-white' : ''} />
        {!collapsed && <span>{title}</span>}
      </button>
      
      {collapsed && showTooltip && buttonRef && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: buttonRef.getBoundingClientRect().right + 8,
            top: buttonRef.getBoundingClientRect().top + buttonRef.getBoundingClientRect().height / 2,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="bg-deepblue-500 text-white text-sm rounded px-3 py-2 whitespace-nowrap shadow-lg">
            {title}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const RouteSelect = ({ collapsed }) => {
  const { user } = useAuth();
  const isOperator = user?.userType === 2; // Check if using operator account

  return (
    <div className="space-y-2">
      <Route
        Icon={FiHome}
        title="Dashboard"
        collapsed={collapsed}
        href="/dashboard"
      />

      {!isOperator && ( 
          <Route
          Icon={FiUser}
          title="Users"
          collapsed={collapsed}
          href="/users"
        />
      )}

      <Route
        Icon={PiUserList}
        title="Request Accounts"
        collapsed={collapsed}
        href="/request"
      />

      <Route
        Icon={FiUsers}
        title="Operator Users"
        collapsed={collapsed}
        href="/operatorUsers"
      />
      
      {!isOperator && (
          <Route
            Icon={RiShieldUserLine}
            title="Operators"
            collapsed={collapsed}
            href="/operators"
          />
      )}
      <Route
        Icon={BsEvStation}
        title="Stations"
        collapsed={collapsed}
        href="/stations"
      />
      <Route
        Icon={MdOutlineElectricCar}
        title="Charging Bays"
        collapsed={collapsed}
        href="/bays"
      />   
      <Route
        Icon={PiPlugChargingBold}
        title="Connectors"
        collapsed={collapsed}
        href="/connectors"
      />
      <Route
        Icon={BsBattery}
        title="Charging Sessions"
        collapsed={collapsed}
        href="/chargingSessions"
      />      
    </div>
  );
};

export default RouteSelect;