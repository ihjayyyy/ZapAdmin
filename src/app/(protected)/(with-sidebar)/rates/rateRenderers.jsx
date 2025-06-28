import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';
import { renderAmount as renderRateBreakdownAmount, renderRateType } from '../rateBreakdowns/rateBreakdownRenderers';

// Custom renderer for charging bay information
export const renderChargingBay = (chargingBayId, chargingBays) => {
  return chargingBays[chargingBayId] || `Unknown (ID: ${chargingBayId})`;
};

// Custom renderer for status
export const renderStatus = (status) => {
  return <StatusChip status={status ? 'available' : 'unavailable'} />;
};

// Custom renderer for action buttons
export const renderActions = (
  _, 
  item, 
  handleViewRate, 
  handleEditRate, 
  handleDeleteConfirmation, 
  handleToggleStatus,
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
          title: isExpanded ? 'Collapse' : 'Expand to see rate breakdowns',
          className: 'hover:bg-gray-100 text-gray-600'
        },
        { onClick: () => handleViewRate(item), icon: FiEye, title: 'View' },
        { onClick: () => handleEditRate(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
        { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
        { 
          onClick: () => handleToggleStatus(item), 
          icon: item.status ? FiToggleRight : FiToggleLeft, 
          title: item.status ? 'Deactivate' : 'Activate', 
          className: 'hover:bg-yellow-100 text-yellow-600' 
        },
      ].filter(Boolean)}
    />
  );
};

// Custom renderer for expand button
export const renderExpandButton = (_, item, expandedRows, handleToggleExpand) => (
  <button
    onClick={() => handleToggleExpand(item)}
    className="p-1 hover:bg-gray-100 rounded transition-colors"
    title={expandedRows.has(item.id) ? 'Collapse' : 'Expand to see rate breakdowns'}
  >
    {expandedRows.has(item.id) ? (
      <FiChevronDown className="text-gray-600" size={16} />
    ) : (
      <FiChevronRight className="text-gray-600" size={16} />
    )}
  </button>
);

// Custom renderer for expanded content
export const renderExpandedContent = (
  _, 
  item, 
  expandedRows, 
  rateBreakdowns, 
  loadingBreakdowns,
  onAddBreakdown,
  onViewBreakdown,
  onEditBreakdown,
  onDeleteBreakdown
) => {
  if (!expandedRows.has(item.id)) {
    return null;
  }

  const breakdowns = rateBreakdowns[item.id] || [];
  const isLoading = loadingBreakdowns.has(item.id);

  return (
    <div className="mt-2 bg-gray-50 rounded p-3 border-l-4 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">Rate Breakdowns for {item.name}</h4>
        <button 
          onClick={() => onAddBreakdown(item)}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Add Breakdown
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading breakdowns...</span>
        </div>
      ) : breakdowns.length > 0 ? (
        <div className="space-y-2">
          {breakdowns.map((breakdown, index) => (
            <div 
              key={breakdown.id || index} 
              className="bg-white rounded p-3 border border-gray-200 text-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 mb-1">{breakdown.name}</div>
                  <div className="text-xs text-gray-500">ID: {breakdown.id}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {renderRateBreakdownAmount(breakdown.amount)}
                    </div>
                  </div>
                  <div>
                    {renderRateType(breakdown.rateType)}
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => onViewBreakdown(breakdown)}
                      className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                      title="View"
                    >
                      <FiEye size={14} />
                    </button>
                    <button 
                      onClick={() => onEditBreakdown(breakdown)}
                      className="p-1 hover:bg-green-100 text-green-600 rounded"
                      title="Edit"
                    >
                      <FiEdit size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteBreakdown(breakdown)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">
          No rate breakdowns found for this rate.
        </div>
      )}
    </div>
  );
};

// Render functions for rate breakdown table columns
export const renderRateBreakdownName = (name) => (
  <span className="font-medium text-gray-800">{name}</span>
);

export const renderRateBreakdownAmountColumn = (amount) => renderRateBreakdownAmount(amount);

export const renderRateTypeColumn = (rateType) => renderRateType(rateType);

// Render function for expanded rate breakdown content
export const renderRateBreakdownItem = (breakdown) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex-1">
      <span className="font-medium text-gray-800">{breakdown.name}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        {renderRateBreakdownAmount(breakdown.amount)}
      </div>
      <div>
        {renderRateType(breakdown.rateType)}
      </div>
    </div>
  </div>
);