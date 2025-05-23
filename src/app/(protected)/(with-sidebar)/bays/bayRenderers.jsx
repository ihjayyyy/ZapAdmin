import React from 'react';
import { renderActionMenu } from '@/components/ActionMenu';
import { FiAlertCircle, FiCheckCircle, FiClock, FiHelpCircle, FiXCircle } from 'react-icons/fi';

export const renderStation = (stationId, stations) =>{
    return stations[stationId] || `Unknown (ID: ${stationId})`
}

export const renderStatus = (status) => {
  const statusConfig = {
    0: {
      icon: <FiHelpCircle className="text-gray-500" size={14} />,
      text: "Undefined",
      textColor: "text-gray-600"
    },
    1: {
      icon: <FiCheckCircle className="text-green-500" size={14} />,
      text: "Available",
      textColor: "text-green-600"
    },
    2: {
      icon: <FiClock className="text-yellow-500" size={14} />,
      text: "Occupied",
      textColor: "text-yellow-600"
    },
    3: {
      icon: <FiXCircle className="text-red-500" size={14} />,
      text: "Unavailable",
      textColor: "text-red-600"
    },
    4: {
      icon: <FiAlertCircle className="text-orange-500" size={14} />,
      text: "Faulted",
      textColor: "text-orange-600"
    }
  };

  const config = statusConfig[status] || statusConfig[0];

  return (
    <div className="flex items-center gap-1">
      {config.icon}
      <span className={config.textColor}>{config.text}</span>
    </div>
  );
};

export const renderActions = (_, item, handleViewBay, handleEditBay, handleDeleteConfirmation, actionMenuOpen, setActionMenuOpen, menuRefs) => {
  return renderActionMenu(
    _, 
    item, 
    handleViewBay, 
    handleEditBay, 
    handleDeleteConfirmation, 
    actionMenuOpen, 
    setActionMenuOpen, 
    menuRefs
  );
};