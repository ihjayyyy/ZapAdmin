import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

// Custom renderer for station information
export const renderStation = (stationId, stations) => {
  return stations[stationId] || `Unknown (ID: ${stationId})`;
};

// Custom renderer for amount and unit
export const renderAmount = (amount, item) => {
  // Format with Philippine Peso (₱) symbol
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP', // Philippine Peso
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // For Flat Rate, we might not need to show the unit
  if (item.rateType === 0) { // Flat Rate
    return (
      <div className="whitespace-nowrap">
        {formatter.format(amount)}
        <span className="text-xs text-gray-500 ml-1">
          / session
        </span>
      </div>
    );
  } else { // Per kWh
    return (
      <div className="whitespace-nowrap">
        {formatter.format(amount)}
        <span className="text-xs text-gray-500 ml-1">
          / {item.unit || 'kWh'}
        </span>
      </div>
    );
  }
};

// Custom renderer for status
export const renderStatus = (isActive) => {
  return <StatusChip status={isActive ? 'available' : 'unavailable'} />;
};

// Custom renderer for action buttons
export const renderActions = (
  _, 
  item, 
  handleViewRate, 
  handleEditRate, 
  handleDeleteConfirmation, 
  handleToggleStatus
) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewRate(item), icon: FiEye, title: 'View' },
      { onClick: () => handleEditRate(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
      { 
        onClick: () => handleToggleStatus(item), 
        icon: item.isActive ? FiToggleRight : FiToggleLeft, 
        title: item.isActive ? 'Deactivate' : 'Activate', 
        className: 'hover:bg-yellow-100 text-yellow-600' 
      },
    ]}
  />
);