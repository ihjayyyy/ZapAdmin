const apiUrl = import.meta.env.VITE_APIURL;

/**
 * Create a new operator
 * @param {Object} operatorData - The operator data
 * @param {string} operatorData.name - Name of the operator
 * @param {string} operatorData.address - Address of the operator
 * @param {string} operatorData.phone - Phone number of the operator
 * @param {string} operatorData.email - Email of the operator
 * @param {string} operatorData.contactPerson - Contact person for the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created operator data
 */
export const createOperator = async (operatorData, token) => {
  const response = await fetch(`${apiUrl}Operator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(operatorData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create operator');
  }

  return data;
};

/**
 * Get all operators
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of operators
 */
export const getAllOperators = async (token) => {
  const response = await fetch(`${apiUrl}Operator`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operators');
  }

  return data;
};

/**
 * Get operator by ID
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Operator data
 */
export const getOperatorById = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Operator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operator');
  }

  return data;
};

/**
 * Update operator
 * @param {string} operatorId - ID of the operator to update
 * @param {Object} operatorData - Updated operator data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated operator data
 */
export const updateOperator = async (operatorId, operatorData, token) => {
  const response = await fetch(`${apiUrl}Operator/${operatorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(operatorData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update operator');
  }

  return data;
};

/**
 * Delete operator
 * @param {string} operatorId - ID of the operator to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteOperator = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Operator/${operatorId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete operator');
  }

  return data;
};

/**
 * Get paginated operators
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pagesize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated operator data
 */
export const getPagedOperators = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}Operator/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated operators');
  }

  return data;
};