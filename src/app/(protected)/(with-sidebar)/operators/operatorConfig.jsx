/**
 * Configuration file for the Operator management page
 * Contains table columns and form fields
 */

import { renderLocation } from '../stations/stationRenderers';
import { 
  renderStationName,
  renderStationStatus, 
  renderStationItem 
} from './operatorRenderers';

// Table columns definition
export const operatorColumns = (renderContact, renderActions, renderExpandedContent) => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { 
    key: 'contact', 
    label: 'Contact', 
    render: renderContact 
  },
  { key: 'contactPerson', label: 'Contact Person' },
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

// Form fields for operator creation/editing
export const operatorFormFields = [
  { 
    name: 'name', 
    label: 'Name', 
    type: 'text',
    required: true,
    gridGroup: 'basic'
  },
  { 
    name: 'address', 
    label: 'Address', 
    type: 'text',
    required: true
  },
  { 
    name: 'email', 
    label: 'Email', 
    type: 'email',
    required: true,
    gridGroup: 'contact'
  },
  { 
    name: 'phone', 
    label: 'Phone', 
    type: 'text',
    required: true,
    gridGroup: 'contact'
  },
  { 
    name: 'contactPerson', 
    label: 'Contact Person', 
    type: 'text',
    required: true,
    gridGroup: 'basic'
  }
];

// Expandable table configuration for Operator → Stations relationship
export const operatorStationConfig = {
  entityName: 'Station',
  parentEntityName: 'Operator',
  title: 'Stations',
  parentNameField: 'name',
  tableColumns: [
    { key: 'id', label: 'ID' },
    { 
      key: 'name', 
      label: 'Name',
      render: renderStationName
    },
    { key: 'address', label: 'Address' },
    { 
      key: 'location', 
      label: 'Location',
      render: (_, station) => renderLocation(_, station)
    },
    { 
      key: 'active', 
      label: 'Status',
      render: renderStationStatus
    },
    { key: 'additionalInfo', label: 'Additional Info' }
  ],
  renderItem: renderStationItem
};