/**
 * Form field definitions for charging bay creation/editing
 * @param {Array} stations - List of available stations
 * @param {Object|null} currentBay - Current bay being edited (if any)
 * @returns {Array} Form field configuration
 */
export const getBayFormFields = (stations) => [
  {
    name: 'maxPower',
    label: 'Max Power (kW)',
    type: 'number',
    placeholder: 'Enter maximum power in kW',
    required: true,
    gridGroup: 'topRow'
  },
  {
    name: 'stationId',
    label: 'Station',
    type: 'select',
    required: true,
    gridGroup: 'topRow',
    options: stations.map(station => ({ 
      value: station.id, 
      label: station.name 
    }))
  },
  {
    name: 'status',
    label: 'Active',
    type: 'checkbox',
    required: false
  }
];

/**
 * Filter options for charging bay filtering
 * @param {Array} stations - List of available stations
 * @returns {Array} Filter configuration
 */
export const getBayFilterOptions = (stations) => [
  {
    type: 'select',
    name: 'stationId',
    label: 'Station',
    options: stations.map(station => ({ 
      value: station.id, 
      label: station.name 
    }))
  },
  {
    type: 'radio',
    name: 'status',
    label: 'Status',
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ]
  }
];

/**
 * Column definitions for charging bay data table
 * @returns {Array} Table column configuration
 */
export const bayColumnDefs = [
  { key: 'id', label: 'ID', width: 'w-1/12', sortable: true },
  { key: 'maxPower', label: 'Max Power (kW)', width: 'w-auto', sortable: true },
  { key: 'stationId', label: 'Station', width: 'w-auto', sortable: true },
  { key: 'active', label: 'Status', type: 'boolean', width: 'w-auto', sortable: true }
];