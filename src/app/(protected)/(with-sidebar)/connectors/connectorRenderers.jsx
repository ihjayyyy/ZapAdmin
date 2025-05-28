import React from 'react';
import { FiEye, FiTrash2, FiCheckCircle, FiXCircle, FiHelpCircle, FiAlertCircle } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';

// Custom renderer for price formatting
export const renderPrice = (price) => {
  return (
    <span className="font-semibold text-green-600">
      ₱{parseFloat(price).toFixed(2)}
    </span>
  );
};

// Improved status renderer for string status values
export const renderStatus = (status) => {
  console.log('renderStatus:', status)
  const normalized = (status || '').toString().toLowerCase();

  const statusConfig = {
    unknown: {
      icon: <FiHelpCircle className="text-gray-500" size={14} />,
      text: "Unknown",
      textColor: "text-gray-600"
    },
    available: {
      icon: <FiCheckCircle className="text-green-500" size={14} />,
      text: "Available",
      textColor: "text-green-600"
    },
    unavailable: {
      icon: <FiXCircle className="text-red-500" size={14} />,
      text: "Unavailable",
      textColor: "text-red-600"
    },
    faulted: {
      icon: <FiAlertCircle className="text-orange-500" size={14} />,
      text: "Faulted",
      textColor: "text-orange-600"
    }
  };

  const config = statusConfig[normalized] || statusConfig['unknown'];

  return (
    <div className="flex items-center gap-1">
      {config.icon}
      <span className={config.textColor}>{config.text}</span>
    </div>
  );
};

// Inline action buttons using ActionButtons
export const renderActions = (_, item, handleViewConnector, handleDeleteConfirmation) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewConnector(item), icon: FiEye, title: 'View' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
    ]}
  />
);