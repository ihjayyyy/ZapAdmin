/**
 * Form field definitions for operator creation/editing
 * @returns {Array} Form field configuration
 */
export const getOperatorFormFields = () => [
  {
    name: 'name',
    label: 'Operator Name',
    type: 'text',
    placeholder: 'Operator Name',
    required: true,
    gridGroup: 'topRow'
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Full Address',
    required: true,
    gridGroup: 'topRow'
  },
  {
    name: 'contactPerson',
    label: 'Contact Person',
    type: 'text',
    placeholder: 'Contact Person Name',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'contact@example.com',
    required: true,
    gridGroup: 'contactInfo'
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1234567890',
    required: true,
    gridGroup: 'contactInfo'
  },
  {
    name: 'active',
    label: 'Status',
    type: 'checkbox',
    defaultValue: true
  }
];

/**
 * Column definitions for operator data table
 * @returns {Array} Table column configuration
 */
export const operatorColumnDefs = [
  { key: 'id', label: 'ID', width: 'w-1/16', sortable: true },
  { key: 'name', label: 'Operator Name', width: 'w-1/6', sortable: true },
  { key: 'address', label: 'Address', width: 'w-1/6', sortable: true },
  { key: 'contactPerson', label: 'Contact Person', width: 'w-1/6', sortable: true },
  { key: 'contact', label: 'Contact', width: 'w-1/6', sortable: false, type: 'contact' },
];