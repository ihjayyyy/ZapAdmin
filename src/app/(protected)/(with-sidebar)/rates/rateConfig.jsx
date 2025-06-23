/**
 * Configuration file for the Rate management page
 * Contains table columns, form fields, and filter options
 */

// Table columns definition
export const rateColumns = (renderStation, renderAmount, renderStatus, renderActions) => [
  { key: 'id', label: 'ID' },
  { 
    key: 'stationId', 
    label: 'Station',
    render: renderStation
  },
  { key: 'name', label: 'Name', className: 'max-column-width' },
  { 
    key: 'rateType', 
    label: 'Rate Type',
    render: (rateType) => {
      // Map rate type enum values to readable text
      const rateTypes = {
        0: 'Flat Rate',
        1: 'Per kWh'
      };
      return rateTypes[rateType] || `Unknown (${rateType})`;
    }
  },
  {
    key: 'amount',
    label: 'Amount',
    render: renderAmount
  },
  {
    key: 'isActive',
    label: 'Status',
    render: renderStatus
  },
  {
    key: 'actions',
    label: 'Actions',
    render: renderActions
  }
];

// Form fields for rate creation/editing
export const rateFormFields = [
  { 
    name: 'stationId', 
    label: 'Station', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'name', 
    label: 'Rate Name', 
    type: 'text',
    required: true,
    gridGroup: 'basic'
  },
  {
    name: 'rateType',
    label: 'Rate Type',
    type: 'select',
    options: [
      { value: 0, label: 'Flat Rate' },
      { value: 1, label: 'Per kWh' }
    ],
    required: true,
    gridGroup: 'pricing'
  },
  { 
    name: 'amount', 
    label: 'Amount', 
    type: 'number',
    step: '0.01',
    required: true,
    gridGroup: 'pricing'
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    defaultValue: true
  }
];

// Filter options configuration for the modal
export const rateFilterOptions = (stationOptions) => [
  {
    type: 'select',
    name: 'stationId',
    label: 'Station',
    options: stationOptions
  },
  {
    type: 'select',
    name: 'rateType',
    label: 'Rate Type',
    options: [
      { value: 0, label: 'Flat Rate' },
      { value: 1, label: 'Per kWh' }
    ]
  },
  {
    type: 'radio',
    name: 'isActive',
    label: 'Status',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ]
  }
];