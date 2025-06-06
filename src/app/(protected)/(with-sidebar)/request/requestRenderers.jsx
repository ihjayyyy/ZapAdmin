import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

// Custom renderer for operator information
export const renderOperator = (operatorId, operators) => {
  return operators[operatorId] || `Unknown (ID: ${operatorId})`;
};

// Custom renderer for user information
export const renderUser = (userId, users) => {
  return users[userId] || `Unknown (ID: ${userId})`;
};

// Custom renderer for status - simplified
export const renderStatus = (status) => {
  // Pass the status directly to StatusChip, no mapping needed
  return <StatusChip status={status} />;
};

// Custom renderer for request date
export const renderRequestDate = (requestedAt) => {
  if (!requestedAt) return 'N/A';
  
  try {
    const date = new Date(requestedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Custom renderer for action buttons - now receives user data as parameter
export const renderActions = (
  _,
  item,
  handleViewRequest,
  handleEditRequest,
  handleDeleteConfirmation,
  handleApproveConfirmation,
  handleRejectConfirmation,
  user // Pass user data as parameter instead of calling useAuth
) => {
  const isOperator = user?.userType === 2;
  const normalizedStatus = (item.status || '').toString().toLowerCase().trim();

  const actions = [
    {
      onClick: () => handleViewRequest(item),
      icon: FiEye,
      title: 'View'
    }
  ];

  if (!isOperator) {
    if (normalizedStatus === 'pending') {
      actions.push(
        {
          onClick: () => handleApproveConfirmation(item),
          icon: FiCheck,
          title: 'Approve',
          className: 'hover:bg-green-100 text-green-600'
        },
        {
          onClick: () => handleRejectConfirmation(item),
          icon: FiX,
          title: 'Reject',
          className: 'hover:bg-orange-100 text-orange-600'
        }
      );
    }
  } else {
    actions.push(
      {
        onClick: () => handleEditRequest(item),
        icon: FiEdit,
        title: 'Edit',
        className: 'hover:bg-blue-100 text-blue-600'
      },
      {
        onClick: () => handleDeleteConfirmation(item),
        icon: FiTrash2,
        title: 'Delete',
        className: 'hover:bg-red-100 text-red-600'
      }
    );
  }

  return <ActionButtons actions={actions} />;
};