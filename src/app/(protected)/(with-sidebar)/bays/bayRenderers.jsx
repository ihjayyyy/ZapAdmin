import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiHelpCircle, FiXCircle, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';

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

// Refactored actions renderer
export const renderActions = (_, item, handleViewBay, handleEditBay, handleDeleteConfirmation) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewBay(item), icon: FiEye, title: 'View' },
      { onClick: () => handleEditBay(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
    ]}
  />
);