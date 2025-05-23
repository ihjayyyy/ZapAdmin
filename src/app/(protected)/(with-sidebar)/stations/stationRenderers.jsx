import React from 'react';
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { renderActionMenu } from '@/components/ActionMenu';

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

// Custom renderer for action buttons - now using shared action menu with toggle status
export const renderActions = (_, item, handleViewStation, handleEditStation, handleDeleteConfirmation, handleToggleStatus, actionMenuOpen, setActionMenuOpen, menuRefs) => {
  // Custom actions for toggle status
  const customActions = [
    {
      label: item.active ? 'Deactivate' : 'Activate',
      handler: handleToggleStatus,
      icon: item.active ? <FiXCircle /> : <FiCheckCircle />,
      className: item.active ? 'text-red-600' : 'text-green-600'
    }
  ];

  return renderActionMenu(
    _, 
    item, 
    handleViewStation, 
    handleEditStation, 
    handleDeleteConfirmation, 
    actionMenuOpen, 
    setActionMenuOpen, 
    menuRefs,
    {
      customActions: customActions
    }
  );
};