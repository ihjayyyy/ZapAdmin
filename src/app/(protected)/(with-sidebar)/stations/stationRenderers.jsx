import React from 'react';
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { FiEye, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

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

export const renderStatus = (active) => {
  return <StatusChip status={active ? 'available' : 'unavailable'} />;
};

// Custom renderer for action buttons - now using ActionButtons
export const renderActions = (
  _, 
  item, 
  handleViewStation, 
  handleEditStation, 
  handleDeleteConfirmation, 
  handleToggleStatus,
  expandedRows,
  handleToggleExpand
) => {
  const isExpanded = expandedRows?.has(item.id);
  
  const actions = [
    expandedRows && handleToggleExpand && {
      onClick: () => handleToggleExpand(item),
      icon: isExpanded ? FiChevronDown : FiChevronRight,
      title: isExpanded ? 'Collapse' : 'Expand Charging Bays',
      className: 'hover:bg-gray-100 text-gray-600'
    },
    { onClick: () => handleViewStation(item), icon: FiEye, title: 'View' },
    { onClick: () => handleEditStation(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
    { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
    { 
      onClick: () => handleToggleStatus(item), 
      icon: item.active ? FiToggleRight : FiToggleLeft, 
      title: item.active ? 'Deactivate' : 'Activate', 
      className: 'hover:bg-yellow-100 text-yellow-600' 
    }
  ].filter(Boolean);

  return <ActionButtons actions={actions} />;
};

// Render functions for charging bay table columns
export const renderChargingBayCode = (code, bay) => (
  <span className="font-medium text-gray-800">{code}</span>
);

export const renderChargingBayMaxPower = (maxPower) => maxPower ? (
  <span className="text-gray-700">{maxPower} kW</span>
) : <span className="text-gray-400">-</span>;

export const renderChargingBayStatus = (status) => {
  const statusMap = {
    0: 'undefined',
    1: 'available', 
    2: 'occupied',
    3: 'unavailable',
    4: 'faulted'
  };
  return <StatusChip status={statusMap[status] || 'undefined'} />;
};

// Render function for expanded charging bay content
export const renderChargingBayItem = (bay) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex-1">
      <div>
        <span className="font-medium text-gray-800">{bay.code}</span>
        <span className="ml-2 text-xs text-gray-500">({bay.stationKey})</span>
      </div>
      {bay.maxPower && (
        <div className="text-xs text-gray-600 mt-1">{bay.maxPower} kW</div>
      )}
    </div>
    <div className="flex items-center gap-3">
      <div>
        <StatusChip status={bay.status === 1 ? 'available' : 'unavailable'} />
      </div>
    </div>
  </div>
);