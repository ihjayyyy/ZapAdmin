const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new operator account request
 * @param {Object} data - The operator account request data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created operator account request data
 */
export const create = async (data, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to create operator account request');
  }

  return responseData;
};

/**
 * Get all operator account requests
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of operator account requests
 */
export const getAll = async (token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operator account requests');
  }

  return data;
};

/**
 * Update operator account request
 * @param {string} requestId - ID of the operator account request to update
 * @param {Object} data - Updated operator account request data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated operator account request data
 */
export const update = async (requestId, data, token) => {
  const { id: _id, ...dataWithoutId } = data;
  
  const response = await fetch(`${apiUrl}OperatorAccountRequest/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithoutId),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to update operator account request');
  }

  return responseData;
};

/**
 * Get operator account request by ID
 * @param {string} requestId - ID of the operator account request
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Operator account request data
 */
export const getById = async (requestId, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/${requestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operator account request');
  }

  return data;
};

/**
 * Delete operator account request
 * @param {string} requestId - ID of the operator account request to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const remove = async (requestId, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/${requestId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete operator account request');
  }

  return data;
};

/**
 * Get operator account requests by user ID
 * @param {string} userId - ID of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of operator account requests for the specified user
 */
export const getByUser = async (userId, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/ByUser/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operator account requests by user');
  }

  return data;
};

/**
 * Update the status of an operator account request
 * @param {number} id - ID of the operator account request
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated operator account request data
 */
export const approveStatus = async (id, adminResponse ,token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/Approve/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ adminResponse }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update operator account request status');
  }

  return data;
};

/**
 * Update the status of an operator account request
 * @param {number} id - ID of the operator account request
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated operator account request data
 */
export const rejectStatus = async (id,adminResponse, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/Reject/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ adminResponse }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update operator account request status');
  }

  return data;
};

/**
 * Get operator account requests with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} [params.searchTerm] - Search term for name/email
 * @param {number} [params.operatorId] - Filter by operator ID
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.requestedByUserId] - Filter by requesting user ID
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.pageSize] - Number of items per page
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated list of operator account requests
 */
export const getPaged = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}OperatorAccountRequest/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated data');
  }

  return data;
};