import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import { renderActionMenu } from '@/components/ActionMenu';

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

// Custom renderer for action buttons - now using shared action menu
export const renderActions = (_, item, handleViewOperator, handleEditOperator, handleDeleteConfirmation, actionMenuOpen, setActionMenuOpen, menuRefs) => {
  return renderActionMenu(
    _, 
    item, 
    handleViewOperator, 
    handleEditOperator, 
    handleDeleteConfirmation, 
    actionMenuOpen, 
    setActionMenuOpen, 
    menuRefs
  );
};