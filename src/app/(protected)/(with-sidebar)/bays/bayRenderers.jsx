import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiHelpCircle, FiXCircle, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

export const renderStation = (stationId, stations) =>{
    return stations[stationId] || `Unknown (ID: ${stationId})`
}

export const renderStatus = (chargingStatus) => {
  return <StatusChip status={chargingStatus} />;
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