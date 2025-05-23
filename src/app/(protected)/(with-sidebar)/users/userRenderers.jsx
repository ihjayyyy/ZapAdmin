import React from 'react';
import { renderActionMenu } from '@/components/ActionMenu';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const renderConfirmed = (confirmed) => {
    return (
        <div className="flex items-center gap-1">
        {confirmed ? (
            <>
                <FiCheckCircle className="text-green-500" size={14} />  
                <span className="text-green-600">Validated</span>
            </>
        ) : (
            <>
                <FiXCircle className="text-red-500" size={14} />
                <span className="text-red-600">Not Validated</span>
            </>
        )}
        </div>
    );
}

export const renderActions = (_, item, handleViewUser, actionMenuOpen, setActionMenuOpen, menuRefs) => {
  return renderActionMenu(
    _, 
    item, 
    handleViewUser, 
    null, 
    null, 
    actionMenuOpen, 
    setActionMenuOpen, 
    menuRefs
  );
};

export const renderUsertype = (userType) => {
    const userTypeMap = {
        0: 'Admin',
        1: 'Customer',
        2: 'Operator'
    };
    
    return userTypeMap[userType] || `Unknown (ID: ${userType})`;
    
}