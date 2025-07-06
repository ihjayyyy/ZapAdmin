/**
 * Configuration file for the Connector management page
 * Contains table columns, form fields, and filter options
 */

// Table columns definition
export const connectorColumns = (renderActions, renderPrice, renderStatus, renderQRCode) => [
  { key: 'id', label: 'ID' },
  { key: 'chargeBayId', label: 'Bay ID' },
  { key: 'connectorType', label: 'Connector Type' },
  { key: 'connectorName', label: 'Connector Name' },
  { 
    key: 'lastStatus', 
    label: 'Last Status',
    render: renderStatus
  },
  { 
    key: 'price', 
    label: 'Price',
    render: renderPrice
  },
  { 
    key: 'qrCode', 
    label: 'QR Code',
    render: renderQRCode
  },
  {
    key: 'actions',
    label: 'Actions',
    render: renderActions
  }
];

// Form fields for connector viewing (read-only)
export const connectorFormFields = [
  { 
    name: 'id', 
    label: 'Connector ID', 
    type: 'number',
    readOnly: true,
    gridGroup: 'basic'
  },
  { 
    name: 'chargeBayId', 
    label: 'Charging Bay ID', 
    type: 'number',
    readOnly: true,
    gridGroup: 'basic'
  },
  { 
    name: 'connectorType', 
    label: 'Connector Type', 
    type: 'text',
    readOnly: true,
    gridGroup: 'details'
  },
  { 
    name: 'connectorName', 
    label: 'Connector Name', 
    type: 'text',
    readOnly: true,
    gridGroup: 'details'
  },
  { 
    name: 'price', 
    label: 'Price', 
    type: 'number',
    step: '0.01',
    readOnly: true,
    gridGroup: 'details'
  },
  { 
    name: 'lastStatus', 
    label: 'Last Status', 
    type: 'text',
    readOnly: true,
    gridGroup: 'status'
  },
  { 
    name: 'qrCode', 
    label: 'QR Code', 
    type: 'qrcode',
    readOnly: true,
    gridGroup: 'qr'
  }
];

// Filter options configuration for the modal
export const connectorFilterOptions = (connectorTypeOptions, chargingBayOptions) => [
  {
    type: 'select',
    name: 'chargingBayId',
    label: 'Charging Bay ID',
    options: chargingBayOptions
  },
  {
    type: 'select',
    name: 'connectorType',
    label: 'Connector Type',
    options: connectorTypeOptions
  },
  {
    type: 'select',
    name: 'lastStatus',
    label: 'Status',
    options: [
      { id: 'Available', name: 'Available' },
      { id: 'Unavailable', name: 'Unavailable' },
      { id: 'Faulted', name: 'Faulted' },
      { id: 'Occupied', name: 'Occupied' },
      { id: 'Unknown', name: 'Unknown' }
    ]
  }
];