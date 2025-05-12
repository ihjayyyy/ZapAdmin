/**
 * Form field definitions for connector creation/editing
 * @param {Array} connectorTypes - List of available connector types
 * @param {Array} bays - List of available charging bays
 * @returns {Array} Form field configuration
 */
export const getConnectorFormFields = (connectorTypes, bays = []) => [
    {
      name: 'chargingBayId',
      label: 'Charging Bay',
      type: 'select',
      placeholder: 'Select charging bay',
      required: true,
      gridGroup: 'topRow',
      options: bays.map(bay => ({ 
        value: bay.id, 
        label: `Bay #${bay.id}`
      }))
    },
    {
      name: 'connectorType',
      label: 'Connector Type',
      type: 'combobox',
      placeholder: 'Select or type connector type',
      required: true,
      gridGroup: 'topRow',
      options: connectorTypes.map(type => ({ 
        value: type, 
        label: type 
      }))
    },
    {
      name: 'price',
      label: 'Price (₱)',
      type: 'number',
      placeholder: 'Enter price in pesos',
      required: true,
      gridGroup: 'bottomRow'
    },
  ];
  
  /**
   * Filter options for connector filtering
   * @param {Array} connectorTypes - List of available connector types
   * @param {Array} bays - List of available charging bays
   * @returns {Array} Filter configuration
   */
  export const getConnectorFilterOptions = (connectorTypes, bays = []) => [
    {
      type: 'select',
      name: 'chargingBayId',
      label: 'Charging Bay',
      options: [
        ...bays.map(bay => ({ 
          value: bay.id, 
          label: `Bay #${bay.id}`
        }))
      ]
    },
    {
        type: 'select',
        name: 'connectorType',
        label: 'Connector Type',
        options: [
          ...connectorTypes.map(type => ({ 
            value: type, 
            label: type 
          }))
        ]
    },
    {
      type: 'select',
      name: 'priceRange',
      label: 'Price Range (₱)',
      options: [
        { value: '0-50', label: '₱0 - ₱50' },
        { value: '51-100', label: '₱51 - ₱100' },
        { value: '101-200', label: '₱101 - ₱200' },
        { value: '201-', label: '₱201+' }
      ]
    }
  ];
  
  /**
   * Column definitions for connector data table
   * @returns {Array} Table column configuration
   */
  export const connectorColumnDefs = [
    { key: 'id', label: 'ID', width: 'w-1/12', sortable: true },
    { key: 'chargingBayId', label: 'Bay ID', width: 'w-1/6', sortable: true },
    { key: 'connectorType', label: 'Type', width: 'w-1/6', sortable: true },
    { key: 'price', label: 'Price (₱)', width: 'w-1/6', sortable: true },
  ];