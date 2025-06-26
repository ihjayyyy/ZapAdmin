import React from 'react';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';

// Custom renderer for rate information
export const renderRate = (rateId, rates) => {
  return rates[rateId] || `Unknown (ID: ${rateId})`;
};

// Custom renderer for amount with currency formatting
export const renderAmount = (amount) => {
  // Format with Philippine Peso (₱) symbol
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return (
    <div className="whitespace-nowrap font-medium">
      {formatter.format(amount)}
    </div>
  );
};

// Custom renderer for rate type
export const renderRateType = (rateType) => {
  const rateTypes = {
    0: { label: 'Flat Rate', className: 'bg-blue-100 text-blue-800' },
    1: { label: 'Per kWh', className: 'bg-green-100 text-green-800' },
    2: { label: 'Per Hour', className: 'bg-yellow-100 text-yellow-800' },
    3: { label: 'Per Session', className: 'bg-purple-100 text-purple-800' }
  };
  
  const type = rateTypes[rateType] || { label: `Unknown (${rateType})`, className: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${type.className}`}>
      {type.label}
    </span>
  );
};

// Custom renderer for action buttons
export const renderActions = (
  _, 
  item, 
  handleViewRateBreakdown, 
  handleEditRateBreakdown, 
  handleDeleteConfirmation
) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewRateBreakdown(item), icon: FiEye, title: 'View' },
      { onClick: () => handleEditRateBreakdown(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' }
    ]}
  />
);
