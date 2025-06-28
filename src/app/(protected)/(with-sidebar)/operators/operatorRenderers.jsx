import React from 'react';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';
import { FiMail, FiPhone, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';

// Custom renderer for contact information
export const renderContact = (_, item) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <FiMail className="text-stone-500" size={14} />
        <span className="text-stone-700">{item.email}</span>
      </div>
      <div className="flex items-center gap-1">
        <FiPhone className="text-stone-500" size={14} />
        <span className="text-stone-700">{item.phone}</span>
      </div>
    </div>
  );
};

// Inline action buttons (no dropdown menu)
export const renderActions = (
  _, 
  item, 
  handleViewOperator, 
  handleEditOperator, 
  handleDeleteConfirmation,
  expandedRows,
  handleToggleExpand
) => {
  const isExpanded = expandedRows && expandedRows.has(item.id);
  
  return (
    <ActionButtons
      actions={[
        expandedRows && handleToggleExpand && {
          onClick: () => handleToggleExpand(item),
          icon: isExpanded ? FiChevronDown : FiChevronRight,
          title: isExpanded ? 'Collapse' : 'Expand to see stations',
          className: 'hover:bg-gray-100 text-gray-600'
        },
        { onClick: () => handleViewOperator(item), icon: FiEye, title: 'View' },
        { onClick: () => handleEditOperator(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
        { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
      ].filter(Boolean)}
    />
  );
};

// Render functions for operator station table columns
export const renderStationName = (name, station) => (
  <div>
    <span className="font-medium text-gray-800">{name}</span>
    {station.code && (
      <span className="ml-2 text-xs text-gray-500">({station.code})</span>
    )}
  </div>
);

export const renderStationStatus = (active) => {
  return <StatusChip status={active ? 'available' : 'unavailable'} />;
};

// Render function for expanded station content
export const renderStationItem = (station) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <div>
          <span className="font-medium text-gray-800">{station.name}</span>
          {station.code && (
            <span className="ml-2 text-xs text-gray-500">({station.code})</span>
          )}
        </div>
        {station.location && (
          <div className="text-xs text-gray-600 mt-1">{station.location}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div>
          <StatusChip status={station.active ? 'available' : 'unavailable'} />
        </div>
      </div>
    </div>
  );
};