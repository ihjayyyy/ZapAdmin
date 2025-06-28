import { 
  renderConnectorType,
  renderConnectorName,
  renderConnectorPrice, 
  renderConnectorStatus, 
  renderConnectorItem 
} from './bayRenderers';

export const bayColumns = (renderStation, renderStatus, renderActions, renderExpandedContent)=>[
    {key: 'id', label: 'ID'},
    {key: 'stationId', label: 'Station', render: renderStation},
    {key: 'code', label: 'Code'},
    {key: 'stationKey', label: 'Station Key'},
    {key: 'maxPower', label:'Max Power'},
    {key: 'status', label:'Status', render:renderStatus},
    { key: 'actions', label: 'Actions', render: renderActions },
    {
      key: 'expandedContent',
      label: '',
      render: renderExpandedContent,
      className: 'hidden' // This will be shown/hidden dynamically
    }
];

export const bayFormFields = [
    {
        name:'stationId',
        label: 'Station',
        type: 'select',
        required: true,
        gridGroup: 'basic'
    },
    {
        name:'code',
        label:'Code',
        type:'text',
        required: true,
        gridGroup:'basic'
    },
    {
        name:'maxPower',
        label:'Max Power',
        type: 'number',
        required: true,
        gridGroup:'basic'
    },
    {
        name: 'stationKey',
        label:'Station Key',
        type:'text',
        required:true,
        gridGroup:'basic'
    }
]

export const bayFilterOptions = (stationOptions)=>[
    {
        type:'select',
        name:'stationId',
        label:'Station',
        options:stationOptions
    },
    {
        type:'select',
        name:'status',
        label:'Status',
        options:[
            {value: 0, label:'Undefined'},
            {value: 1, label: 'Available'},
            {value: 2, label: 'Occupied'},
            {value: 3, label: 'Unavailable'},
            {value: 4, label: 'Faulted'}
        ]
    }
]

// Expandable table configuration for Bay → Connectors relationship
export const bayConnectorConfig = {
  entityName: 'Connector',
  parentEntityName: 'Charging Bay',
  title: 'Connectors',
  parentNameField: 'code',
  tableColumns: [
    { key: 'id', label: 'ID' },
    { 
      key: 'connectorType', 
      label: 'Connector Type',
      render: renderConnectorType
    },
    { 
      key: 'connectorName', 
      label: 'Connector Name',
      render: renderConnectorName
    },
    { 
      key: 'price', 
      label: 'Price',
      render: renderConnectorPrice
    },
    { 
      key: 'lastStatus', 
      label: 'Status',
      render: renderConnectorStatus
    }
  ],
  renderItem: renderConnectorItem
};