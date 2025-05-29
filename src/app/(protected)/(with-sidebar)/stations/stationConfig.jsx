/**
 * Configuration file for the Station management page
 * Contains table columns, form fields, and filter options
 */

// Table columns definition
export const stationColumns = (renderOperator, renderLocation, renderStatus, renderActions) => [
  { key: 'id', label: 'ID' },
  { 
    key: 'operatorId', 
    label: 'Operator',
    render: renderOperator
  },
  { key: 'name', label: 'Name',className: 'max-column-width'  },
  { key: 'address', label: 'Address', className: 'max-column-width' },
  {
    key: 'location',
    label: 'Location',
    render: renderLocation
  },
  {
    key: 'active',
    label: 'Status',
    render: renderStatus
  },
  { key: 'additionalInfo', label: 'Additional Info' },
  {
    key: 'actions',
    label: 'Actions',
    render: renderActions
  }
];

// Form fields for station creation/editing
export const stationFormFields = [
  { 
    name: 'operatorId', 
    label: 'Operator', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'name', 
    label: 'Station Name', 
    type: 'text',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'address', 
    label: 'Address', 
    type: 'text',
    required: true,
  },
  { 
    name: 'latitude', 
    label: 'Latitude', 
    type: 'number',
    step: '0.000001',
    required: true,
    gridGroup: 'coordinates'
  },
  { 
    name: 'longitude', 
    label: 'Longitude', 
    type: 'number',
    step: '0.000001',
    required: true,
    gridGroup: 'coordinates'
  },
  { 
    name: 'additionalInfo', 
    label: 'Additional Information', 
    type: 'textarea',
  }
];

// Filter options configuration for the modal
export const stationFilterOptions = (operatorOptions) => [
  {
    type: 'select',
    name: 'operatorId',
    label: 'Operator',
    options: operatorOptions
  },
  {
    type: 'radio',
    name: 'active',
    label: 'Status',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ]
  }
];