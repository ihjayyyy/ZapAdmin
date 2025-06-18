const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new user operator
 * @param {Object} userOperatorData - The user operator data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created user operator data
 */
export const createUserOperator = async (userOperatorData, token) => {
  const response = await fetch(`${apiUrl}UserOperator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userOperatorData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user operator');
  }

  return data;
};

/**
 * Get all user operators
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of user operators
 */
export const getAllUserOperators = async (token) => {
  const response = await fetch(`${apiUrl}UserOperator`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user operators');
  }

  return data;
};

/**
 * Update user operator
 * @param {string} userOperatorId - ID of the user operator to update
 * @param {Object} userOperatorData - Updated user operator data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated user operator data
 */
export const updateUserOperator = async (userOperatorId, userOperatorData, token) => {
  const { id: _id, ...dataWithoutId } = userOperatorData;
  
  const response = await fetch(`${apiUrl}UserOperator/${userOperatorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithoutId),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user operator');
  }

  return data;
};

/**
 * Get user operator by ID
 * @param {string} userOperatorId - ID of the user operator
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - User operator data
 */
export const getUserOperatorById = async (userOperatorId, token) => {
  const response = await fetch(`${apiUrl}UserOperator/${userOperatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user operator');
  }

  return data;
};

/**
 * Delete user operator
 * @param {string} userOperatorId - ID of the user operator to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteUserOperator = async (userOperatorId, token) => {
  const response = await fetch(`${apiUrl}UserOperator/${userOperatorId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    // Only try to parse error response
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete station');
  }

  // If response is OK (200), just return true or empty object
  return { success: true };
};

/**
 * Get user operators by user ID
 * @param {string} userId - ID of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of user operators for the specified user
 */
export const getUserOperatorsByUser = async (userId, token) => {
  const response = await fetch(`${apiUrl}UserOperator/ByUser/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user operators by user');
  }

  return data;
};

/**
 * Get user operators by operator ID
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of user operators for the specified operator
 */
export const getUserOperatorsByOperator = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}UserOperator/ByOperator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user operators by operator');
  }

  return data;
};