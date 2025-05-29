import { Abel } from "next/font/google";

export const bayColumns = (renderStation, renderStatus, renderActions)=>[
    {key: 'id', label: 'ID'},
    {key: 'stationId', label: 'Station', render: renderStation},
    {key: 'code', label: 'Code'},
    {key: 'stationKey', label: 'Station Key'},
    {key: 'maxPower', label:'Max Power'},
    {key: 'status', label:'Status', render:renderStatus},
    { key: 'actions', label: 'Actions', render: renderActions }
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