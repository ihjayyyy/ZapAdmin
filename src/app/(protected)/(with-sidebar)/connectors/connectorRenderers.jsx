import React from 'react';
import { renderActionMenu } from '@/components/ActionMenu';

// Custom renderer for price formatting
export const renderPrice = (price) => {
  return (
    <span className="font-semibold text-green-600">
      ₱{parseFloat(price).toFixed(2)}
    </span>
  );
};

// Custom renderer for action buttons - using shared action menu without edit
export const renderActions = (_, item, handleViewConnector, handleDeleteConfirmation, actionMenuOpen, setActionMenuOpen, menuRefs) => {
  return renderActionMenu(
    _, 
    item, 
    handleViewConnector, 
    null, // No edit function - pass null instead of handleEditConnector
    handleDeleteConfirmation, 
    actionMenuOpen, 
    setActionMenuOpen, 
    menuRefs
  );
};