import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import { FiEye } from 'react-icons/fi';

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

// Inline action button (no dropdown menu)
export const renderActions = (_, item, handleViewUser) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewUser(item), icon: FiEye, title: 'View' },
    ]}
  />
);

export const renderUsertype = (userType) => {
    const userTypeMap = {
        0: 'Admin',
        1: 'Customer',
        2: 'Operator'
    };
    
    return userTypeMap[userType] || `Unknown (ID: ${userType})`;
}