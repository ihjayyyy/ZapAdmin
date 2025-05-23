'use client';

import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import { BsEvStation } from "react-icons/bs";
import { MdOutlineElectricCar } from "react-icons/md";
import { PiPlugChargingBold } from "react-icons/pi";
import { useRouter } from "next/navigation";

import { getAllChargingBays } from "@/services/ChargingBayServices";
import { getAllConnectors } from "@/services/ConnectorServices";
import { getAllOperators } from "@/services/OperatorServices";
import { getAllStations } from "@/services/StationServices";

function StatCards() {
  const [stats, setStats] = useState({
    chargingBays: 0,
    connectors: 0,
    operators: 0,
    stations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [chargingBays, connectors, operators, stations] = await Promise.all([
        getAllChargingBays(),
        getAllConnectors(),
        getAllOperators(),
        getAllStations()
      ]);

      setStats({
        chargingBays: chargingBays.length,
        connectors: connectors.length,
        operators: operators.length,
        stations: stations.length
      });
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Operators',
      value: stats.operators,
      icon: RiShieldUserLine,
      href: '/operators',
      color: 'deepblue'
    },
    {
      title: 'Stations',
      value: stats.stations,
      icon: BsEvStation,
      href: '/stations',
      color: 'deepblue'
    },
        {
      title: 'Charging Bays',
      value: stats.chargingBays,
      icon: MdOutlineElectricCar,
      href: '/bays',
      color: 'deepblue'
    },
    {
      title: 'Connectors',
      value: stats.connectors,
      icon: PiPlugChargingBold,
      href: '/connectors',
      color: 'deepblue'
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </>
  );
}

function Card({ title, value, icon: Icon, href, color }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(href);
  };

  // Color configurations
  const colorConfig = {
    deepblue: {
      iconBg: 'bg-blue-900/10',
      iconText: 'text-blue-900',
      buttonBg: 'bg-blue-900/5 hover:bg-blue-900/10',
      buttonText: 'text-blue-900 hover:text-blue-950',
      buttonBorder: 'border-blue-800 hover:border-blue-900'
    }
  };

  const colors = colorConfig[color] || colorConfig.deepblue;

  return (
    <div className="col-span-6 lg:col-span-3 p-6 rounded-lg border border-stone-200 bg-white hover:shadow-lg transition-all duration-200 hover:border-stone-300">
      <div className="flex mb-6 items-center justify-between">
        <h3 className="text-stone-600 text-sm font-medium">{title}</h3>
        <span className={`p-2 rounded-lg ${colors.iconBg}`}>
          {Icon && <Icon size={20} className={colors.iconText} />}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-stone-800 mb-1">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-stone-500">Total count</p>
      </div>

      <button
        onClick={handleRedirect}
        className={`
          cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          border transition-all duration-200 font-medium text-sm
          ${colors.buttonBg} ${colors.buttonText} ${colors.buttonBorder}
          hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
      >
        <span>View All</span>
        <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

export default StatCards;
