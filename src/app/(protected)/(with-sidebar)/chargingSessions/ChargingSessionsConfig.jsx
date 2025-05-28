export const chargingColumns = (renderActions, renderStatus, renderDate, renderSessionDetails) => [
    {key: 'id', label: 'ID'},
    {key: 'stationName', label: 'Station Name'},
    {key:'vehicleName', label: 'Vehicle Name'},
    {key:'connector', label: 'Connector Type'},
    {key:'chargingStart',label: 'Date', render: renderDate},
    {key: 'sessionDetails', label: 'Session Details', render: renderSessionDetails},
    {key: 'chargingStatus', label: 'Status', render: renderStatus},
    {key: 'actions', label: '', render: renderActions}
];

export const chargingSessionsFormFields = [
    {name: 'id', label: 'ID', type: 'text', disabled: true, gridGroup: 'basic'},
    {name: 'stationName', label: 'Station Name', type: 'text', disabled: true, gridGroup: 'basic'},
    {name: 'stationAddress', label: 'Station Address', type: 'text', disabled: true, gridGroup: 'basic'},
    {name: 'vehicleName', label: 'Vehicle Name', type: 'text', disabled: true, gridGroup: 'basic'},
    {name: 'connector', label: 'Connector Type', type: 'text', disabled: true, gridGroup: 'basic'},
    {name: 'chargingStart', label: 'Charging Start', type: 'datetime-local', disabled: true, gridGroup: 'session'},
    {name: 'chargingEnd', label: 'Charging End', type: 'datetime-local', disabled: true, gridGroup: 'session'},
    {name: 'kilowatt', label: 'Energy (kWh)', type: 'number', disabled: true, gridGroup: 'session'},
    {name: 'chargingRate', label: 'Charging Rate (kW)', type: 'number', disabled: true, gridGroup: 'session'},
    {name: 'amount', label: 'Amount', type: 'number', disabled: true, gridGroup: 'session'},
    {name: 'chargingStatus', label: 'Status', type: 'select', disabled: true, options: [
        {value: 0, label: 'Pending'},
        {value: 1, label: 'In Progress'},
        {value: 2, label: 'Completed'},
        {value: 3, label: 'Failed'},
        {value: 4, label: 'Cancelled'}
    ], gridGroup: 'session'}
];

export const chargingSessionsFilterOptions = () => [
    {
        type: 'select',
        name: 'chargingStatus',
        label: 'Charging Status',
        options: [
            {value: 0, label: 'Pending'},
            {value: 1, label: 'In Progress'},
            {value: 2, label: 'Completed'},
            {value: 3, label: 'Failed'},
            {value: 4, label: 'Cancelled'}
        ]
    },
    {
        type: 'text',
        name: 'stationName',
        label: 'Station Name'
    },
    {
        type: 'text',
        name: 'vehicleName', 
        label: 'Vehicle Name'
    },
    {
        type: 'date',
        name: 'startDate',
        label: 'Start Date (From)'
    },
    {
        type: 'date',
        name: 'endDate',
        label: 'End Date (To)'
    }
];