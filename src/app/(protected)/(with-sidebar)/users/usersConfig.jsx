export const usersColumns = (renderActions, renderConfirmed, renderUsertype) => [
    {key: 'email', label: 'Email',  className: 'max-column-width'},
    {key: 'userName', label: 'User Name',  className: 'max-column-width'},
    {key: 'firstName', label: 'First Name'},
    {key: 'lastName', label: 'Last Name'},
    {key: 'userType', label: 'User Type', render: renderUsertype},
    {key: 'confirmed', label: 'Confirmed', render: renderConfirmed},
    {key: 'actions', label: 'Actions', render: renderActions}
]

export const usersFormFields = [
    {name: 'userType', label: 'User Type', type: 'select', required: true, options: [
        {value: 0, label: 'Admin'},
        {value: 1, label: 'Customer'},
        {value: 2, label: 'Operator'},],
        gridGroup: 'basic'
    },
    {name: 'userName', label: 'User Name', type: 'text', required: true, gridGroup: 'basic'},
    {name: 'firstName', label: 'First Name', type: 'text', required: true , gridGroup: 'basic'},
    {name: 'lastName', label: 'Last Name', type: 'text', required: true , gridGroup: 'basic'},
    {name: 'email', label: 'Email', type: 'text', required: true , gridGroup: 'basic'}, 
]

export const usersFilterOptions = () => [
    {
        type: 'select',
        name: 'userType',
        label: 'User Type',
        options: [
            {value: 0, label: 'Admin'},
            {value: 1, label: 'Customer'},
            {value: 2, label: 'Operator'}
        ]
    },
    {
        type: 'radio',
        name: 'confirmed',
        label: 'IsValidated',
        options: [
            { value: true, label: 'Validated' },
            { value: false, label: 'Not Validated' }
        ]
    }
]