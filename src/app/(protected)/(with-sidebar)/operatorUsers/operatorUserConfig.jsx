export const operatorUserColumns = (renderRole, renderActions) => [
  { key: 'id', label: 'ID' },
  { key: 'userName', label: 'User' },
  { key: 'operatorName', label: 'Operator' },
  { key: 'userOperatorRoleName', label: 'Role', render: renderRole },
  { key: 'actions', label: 'Actions', render: renderActions }
];

export const operatorUserFormFields = [
  { name: 'userId', label: 'User', type: 'select', required: true, gridGroup: 'basic' },
  { name: 'operatorId', label: 'Operator', type: 'select', required: true, gridGroup: 'basic' },
  { name: 'userOperatorRole', label: 'Role', type: 'select', required: true, gridGroup: 'basic' },
];


export const operatorUserFilterOptions = (roleOptions) => [
  {
    type: 'select',
    name: 'userOperatorRole',
    label: 'Role',
    options: roleOptions
  },
];