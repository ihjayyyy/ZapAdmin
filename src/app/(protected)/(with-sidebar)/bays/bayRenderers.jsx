import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiHelpCircle, FiXCircle, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

export const renderStation = (stationId, stations) =>{
    return stations[stationId] || `Unknown (ID: ${stationId})`
}

export const renderStatus = (chargingStatus) => {
  return <StatusChip status={chargingStatus} />;
};

// Refactored actions renderer
export const renderActions = (
  _, 
  item, 
  handleViewBay, 
  handleEditBay, 
  handleDeleteConfirmation,
  expandedRows,
  handleToggleExpand
) => {
  const isExpanded = expandedRows && expandedRows.has(item.id);
  
  const actions = [
    expandedRows && handleToggleExpand && {
      onClick: () => handleToggleExpand(item),
      icon: isExpanded ? FiChevronDown : FiChevronRight,
      title: isExpanded ? 'Collapse' : 'Expand Connectors',
      className: 'hover:bg-gray-100 text-gray-600'
    },
    { onClick: () => handleViewBay(item), icon: FiEye, title: 'View' },
    { onClick: () => handleEditBay(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
    { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
  ].filter(Boolean);

  return <ActionButtons actions={actions} />;
};

// Render functions for connector table columns in expandable bay table
export const renderConnectorType = (connectorType) => (
  <span className="font-medium text-gray-800">{connectorType}</span>
);

export const renderConnectorName = (connectorName) => (
  <span className="text-gray-700">{connectorName}</span>
);

export const renderConnectorPrice = (price) => (
  <span className="font-semibold text-green-600">
    ₱{parseFloat(price || 0).toFixed(2)}
  </span>
);

export const renderConnectorStatus = (lastStatus) => {
  return <StatusChip status={lastStatus} />;
};

// Render function for expanded connector content
export const renderConnectorItem = (connector) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex-1">
      <div>
        <span className="font-medium text-gray-800">{connector.connectorType}</span>
        {connector.connectorName && (
          <span className="ml-2 text-xs text-gray-500">({connector.connectorName})</span>
        )}
      </div>
      {connector.price && (
        <div className="text-xs text-gray-600 mt-1">₱{parseFloat(connector.price).toFixed(2)}</div>
      )}
    </div>
    <div className="flex items-center gap-3">
      <div>
        <StatusChip status={connector.lastStatus} />
      </div>
    </div>
  </div>
);