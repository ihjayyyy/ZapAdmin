/**
 * Configuration file for the Rate Breakdown management page
 * Contains table columns, form fields, and filter options
 */

// Rate type enum mapping
export const rateTypeOptions = [
  { value: 0, label: 'Flat Rate' },
  { value: 1, label: 'Per kWh' }
];

// Table columns definition
export const rateBreakdownColumns = (renderRate, renderAmount, renderRateType, renderActions) => [
  { key: 'id', label: 'ID' },
  { 
    key: 'rateId', 
    label: 'Rate',
    render: renderRate
  },
  { key: 'name', label: 'Name', className: 'max-column-width' },
  {
    key: 'amount',
    label: 'Amount',
    render: renderAmount
  },
  {
    key: 'rateType',
    label: 'Rate Type',
    render: renderRateType
  },
  {
    key: 'actions',
    label: 'Actions',
    render: renderActions
  }
];

// Form fields for rate breakdown creation/editing
export const rateBreakdownFormFields = [
  { 
    name: 'rateId', 
    label: 'Rate', 
    type: 'select',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'name', 
    label: 'Breakdown Name', 
    type: 'text',
    required: true,
    gridGroup: 'basic'
  },
  {
    name: 'rateType',
    label: 'Rate Type',
    type: 'select',
    options: rateTypeOptions,
    required: true,
    gridGroup: 'pricing'
  },
  { 
    name: 'amount', 
    label: 'Amount (₱)', 
    type: 'number',
    step: '0.01',
    min: '0',
    required: true,
    gridGroup: 'pricing'
  }
];

// Filter options configuration for the modal
export const rateBreakdownFilterOptions = (rateOptions) => [
  {
    type: 'select',
    name: 'rateId',
    label: 'Rate',
    options: rateOptions
  },
  {
    type: 'select',
    name: 'rateType',
    label: 'Rate Type',
    options: rateTypeOptions
  }
];
