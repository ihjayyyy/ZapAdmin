import ActionButtons from '@/components/ActionButtons';
import { FiEye, FiEdit, FiTrash2, } from 'react-icons/fi';

export const renderOperator = (operatorId, operators) => {
  return operators[operatorId]?.name || `Unknown (ID: ${operatorId})`;
};

// Add renderUser function
export const renderUser = (userId, users) => {
  const user = users[userId];
  if (!user) return `Unknown (ID: ${userId})`;
  
  // Display userName, or fallback to firstName + lastName
  return user.userName || `${user.firstName} ${user.lastName}`.trim() || `User ${userId}`;
};

export const renderActions = (
  _, 
  item, 
  handleViewOperatorUser, 
  handleEditOperatorUser, 
  handleDeleteConfirmation, 
) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewOperatorUser(item), icon: FiEye, title: 'View' },
      { onClick: () => handleEditOperatorUser(item), icon: FiEdit, title: 'Edit', className: 'hover:bg-blue-100 text-blue-600' },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
    ]}
  />
);