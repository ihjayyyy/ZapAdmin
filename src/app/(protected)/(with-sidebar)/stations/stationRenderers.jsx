import React from 'react';
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { FiCheckCircle, FiXCircle, FiEye, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';

// Custom renderer for operator information
export const renderOperator = (operatorId, operators) => {
  return operators[operatorId] || `Unknown (ID: ${operatorId})`;
};

// Custom renderer for location coordinates
export const renderLocation = (_, item) => {
  return (
    <>
    <div className="flex items-center gap-1">
      <TbWorldLatitude className="text-stone-500" size={14} />
      <span className="text-stone-700">
        {item.latitude}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <TbWorldLongitude className="text-stone-500" size={14} />
      <span className="text-stone-700">
        {item.longitude}
      </span>
    </div>
    </>
  );
};

// Custom renderer for active status
export const renderStatus = (active) => {
  return (
    <div className="flex items-center gap-1">
      {active ? (
        <>
          <FiCheckCircle className="text-green-500" size={14} />
          <span className="text-green-600">Active</span>
        </>
      ) : (
        <>
          <FiXCircle className="text-red-500" size={14} />
          <span className="text-red-600">Inactive</span>
        </>
      )}
    </div>
  );
};

// Custom renderer for action buttons - now using ActionButtons
export const renderActions = (
  _, 
  item, 
  handleViewStation, 
  handleEditStation, 
  handleDeleteConfirmation, 
  handleToggleStatus
) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewStation(item), icon: FiEye, title: 'View' },
      { onClick: () => handleEditStation(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
      { 
        onClick: () => handleToggleStatus(item), 
        icon: item.active ? FiToggleRight : FiToggleLeft, 
        title: item.active ? 'Deactivate' : 'Activate', 
        className: 'hover:bg-yellow-100 text-yellow-600' 
      },
    ]}
  />
);