// Update columns to include user rendering
export const operatorUserColumns = (renderOperator, renderUser, renderActions, operators, users) => [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'User', render: (userId) => renderUser(userId, users) },
  { key: 'operatorId', label: 'Operator', render: (operatorId) => renderOperator(operatorId, operators) },
  { key: 'actions', label: 'Actions', render: renderActions }
];

export const operatorUserFormFields = [
  { 
    name: 'userId', // Fixed the name to match the property
    label: 'User', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'operatorId', 
    label: 'Operator', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
];

export const operatorUserFilterOptions = (operatorOptions) => [
  {
    type: 'select',
    name: 'operatorId',
    label: 'Operator',
    options: operatorOptions
  },
];