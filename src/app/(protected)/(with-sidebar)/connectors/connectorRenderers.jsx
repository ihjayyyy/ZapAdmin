import React from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

// Custom renderer for price formatting
export const renderPrice = (price) => {
  return (
    <span className="font-semibold text-green-600">
      ₱{parseFloat(price).toFixed(2)}
    </span>
  );
};

export const renderStatus = (chargingStatus) => {
  return <StatusChip status={chargingStatus} />;
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