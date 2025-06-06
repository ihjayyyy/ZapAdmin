/**
 * Configuration file for the Operator Account Request management page
 * Contains table columns, form fields, and filter options
 */

// Table columns definition
export const requestColumns = (renderOperator, renderUser, renderStatus, renderRequestDate, renderActions) => [
  { key: 'id', label: 'ID' },
  { 
    key: 'requestedByUserId', 
    label: 'Requested By User', 
    render: renderUser
  },
  { 
    key: 'operatorId', 
    label: 'Operator',
    render: renderOperator
  },
  { key: 'email', label: 'Email', className: 'max-column-width' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { 
    key: 'requestedAt', 
    label: 'Requested Date',
    render: renderRequestDate
  },
  { 
    key: 'status', 
    label: 'Status',
    render: renderStatus
  },
  {
    key: 'actions',
    label: 'Actions',
    render: renderActions
  }
];

// Form fields for request creation/editing
export const requestFormFields = [
  { 
    name: 'operatorId', 
    label: 'Operator', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'email', 
    label: 'Email', 
    type: 'email',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'firstName', 
    label: 'First Name', 
    type: 'text',
    required: true,
    gridGroup: 'name'
  },
  { 
    name: 'lastName', 
    label: 'Last Name', 
    type: 'text',
    required: true,
    gridGroup: 'name'
  }
];

export const requestFilterOptions = (operatorOptions, userOptions) => [
  {
    type: 'select',
    name: 'requestedByUserId',
    label: 'Requested By User',
    options: userOptions
  },
  {
    type: 'select',
    name: 'operatorId',
    label: 'Operator',
    options: operatorOptions
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' }
    ]
  }
];