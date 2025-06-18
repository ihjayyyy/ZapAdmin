const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new connector
 * @param {Object} connectorData - The connector data
 * @param {string} connectorData.connectorType - Type of the connector
 * @param {number} connectorData.chargingPayId - ID of the charging pay method
 * @param {number} connectorData.price - Price for charging
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created connector data
 */
export const createConnector = async (connectorData, token) => {
  const response = await fetch(`${apiUrl}Connector`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(connectorData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create connector');
  }

  return data;
};

/**
 * Get all connectors
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of connectors
 */
export const getAllConnectors = async (token) => {
  const response = await fetch(`${apiUrl}Connector`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch connectors');
  }

  return data;
};

/**
 * Get connector by ID
 * @param {string} connectorId - ID of the connector
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Connector data
 */
export const getConnectorById = async (connectorId, token) => {
  const response = await fetch(`${apiUrl}Connector/${connectorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch connector');
  }

  return data;
};

/**
 * Update connector
 * @param {string} connectorId - ID of the connector to update
 * @param {Object} connectorData - Updated connector data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated connector data
 */
export const updateConnector = async (connectorId, connectorData, token) => {
  const { id:_id, ...dataWithoutId }= connectorData;
  
  const response = await fetch(`${apiUrl}Connector/${connectorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithoutId),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update connector');
  }

  return data;
};

/**
 * Delete connector
 * @param {string} connectorId - ID of the connector to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteConnector = async (connectorId, token) => {
  const response = await fetch(`${apiUrl}Connector/${connectorId}`, {
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
 * Get connector types
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of connector types
 */
export const getConnectorTypes = async (token) => {
  const response = await fetch(`${apiUrl}Connector/types`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch connector types');
  }

  return data;
};

/**
 * Get paginated connectors
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pagesize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated connector data
 */
export const getPagedConnectors = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}Connector/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated connectors');
  }

  return data;
};

/**
 * Get connectors filtered by operatorId
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of connectors for the specified operator
 */
export const getConnectorByOperatorId = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Connector/ByOperator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch connectors for operator');
  }

  return data;
};