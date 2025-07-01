/**
 * Configuration file for the Rate management page
 * Contains table columns, form fields, and filter options
 */

import { 
  renderRateBreakdownName,
  renderRateBreakdownAmountColumn, 
  renderRateTypeColumn, 
  renderRateBreakdownItem 
} from './rateRenderers';

// Table columns definition
export const rateColumns = (renderConnector, renderStatus, renderActions, renderExpandedContent) => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', className: 'max-column-width' },
  { 
    key: 'connectorId', 
    label: 'Connector',
    render: renderConnector
  },
  {
    key: 'additionalFee',
    label: 'Additional Fee',
    render: (value) => `$${Number(value || 0).toFixed(2)}`
  },
  {
    key: 'rateKWH',
    label: 'Rate/kWh',
    render: (value) => `$${Number(value || 0).toFixed(2)}`
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
  },
  {
    key: 'expandedContent',
    label: '',
    render: renderExpandedContent,
    className: 'hidden' // This will be shown/hidden dynamically
  }
];

// Form fields for rate creation/editing
export const rateFormFields = [
  { 
    name: 'connectorId', 
    label: 'Connector', 
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
    name: 'status',
    label: 'Active',
    type: 'checkbox',
    defaultValue: true,
    gridGroup: 'basic'
  }
];

// Filter options configuration for the modal
export const rateFilterOptions = (connectorOptions) => [
  {
    type: 'select',
    name: 'connectorId',
    label: 'Connector',
    options: connectorOptions
  },
  {
    type: 'radio',
    name: 'status',
    label: 'Status',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ]
  }
];

// Expandable table configuration for Rate → Rate Breakdowns relationship
export const rateBreakdownConfig = {
  entityName: 'Rate Breakdown',
  parentEntityName: 'Rate',
  title: 'Rate Breakdowns',
  parentNameField: 'name',
  tableColumns: [
    { 
      key: 'name', 
      label: 'Name',
      render: renderRateBreakdownName
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: renderRateBreakdownAmountColumn
    },
    { 
      key: 'rateType', 
      label: 'Rate Type',
      render: renderRateTypeColumn
    }
  ],
  renderItem: renderRateBreakdownItem
};