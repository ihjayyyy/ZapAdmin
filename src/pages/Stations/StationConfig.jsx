/**
 * Form field definitions for station creation/editing
 * @param {Object} params - Parameters needed for configuration
 * @param {boolean} params.isAdmin - Whether current user is admin
 * @param {Object|null} params.currentStation - Current station being edited (if any)
 * @returns {Array} Form field configuration
 */
export const getStationFormFields = ({ isAdmin, currentStation }) => [
    {
      name: 'name',
      label: 'Station Name',
      type: 'text',
      placeholder: 'Station Name',
      required: true,
      gridGroup: 'topRow'
    },
    {
      name: 'operatorId',
      label: 'Operator',
      type: 'select',
      required: true,
      disabled: !isAdmin && currentStation?.id,
      disabledMessage: 'Operator cannot be changed for existing stations in operator view',
      gridGroup: 'topRow',
      hidden: !(isAdmin || currentStation?.id)
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Full Address',
      required: true
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
      placeholder: 'Any additional station details...'
    },
  ];
  
  /**
   * Filter options for station filtering
   * @param {Array} operators - List of available operators
   * @returns {Array} Filter configuration
   */
  export const getStationFilterOptions = (operators) => [
    {
      type: 'select',
      name: 'operatorId',
      label: 'Operator',
      options: operators
    },
    {
      type: 'radio',
      name: 'active',
      label: 'Status',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    }
  ];
  
  /**
   * Column definitions for station data table
   * @returns {Array} Table column configuration
   */
  export const stationColumnDefs = [
    { key: 'id', label: 'ID', width: 'w-1/12', sortable: true },
    { key: 'name', label: 'Station Name', width: 'w-auto', sortable: true },
    { key: 'address', label: 'Address', width: 'w-auto', sortable: true },
    { key: 'coordinates', label: 'Coordinates', width: 'w-auto', sortable: false, type: 'coordinates' },
    { key: 'operatorId', label: 'Operator', width: 'w-auto', sortable: true },
    { key: 'active', label: 'Status', type: 'boolean', width: 'w-auto', sortable: true },
  ];