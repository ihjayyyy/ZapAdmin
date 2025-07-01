const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new rate
 * @param {Object} rateData - The rate data
 * @param {string} rateData.name - Name of the rate
 * @param {number} rateData.connectorId - ID of the connector
 * @param {boolean} rateData.status - Whether the rate is active
 * @param {number} rateData.additionalFee - Additional fee for the rate
 * @param {number} rateData.rateKWH - Rate per kWh
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created rate data
 */
export const createRate = async (rateData, token) => {
  // Convert to match the API expected format
  const apiData = {
    name: rateData.name,
    connectorId: Number(rateData.connectorId),
    status: rateData.status !== false
  };

  const response = await fetch(`${apiUrl}Rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(apiData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create rate');
  }

  return data;
};

/**
 * Get all rates
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of rates
 */
export const getAllRates = async (token) => {
  const response = await fetch(`${apiUrl}Rate`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rates');
  }

  return data;
};

/**
 * Get rate by ID
 * @param {string} rateId - ID of the rate
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Rate data
 */
export const getRateById = async (rateId, token) => {
  const response = await fetch(`${apiUrl}Rate/${rateId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rate');
  }

  return data;
};

/**
 * Update rate
 * @param {string} rateId - ID of the rate to update
 * @param {Object} rateData - Updated rate data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated rate data
 */
export const updateRate = async (rateId, rateData, token) => {
  // Convert to match the API expected format
  const apiData = {
    name: rateData.name,
    connectorId: Number(rateData.connectorId),
    status: rateData.status !== false
  };

  const response = await fetch(`${apiUrl}Rate/${rateId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(apiData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update rate');
  }

  return data;
};

/**
 * Delete rate
 * @param {string} rateId - ID of the rate to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteRate = async (rateId, token) => {
  const response = await fetch(`${apiUrl}Rate/${rateId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    // Only try to parse error response
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete rate');
  }

  // If response is OK (200), just return true or empty object
  return { success: true };
};

/**
 * Get rates by connector ID
 * @param {string} connectorId - ID of the connector
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of rates for the connector
 */
export const getRatesByConnector = async (connectorId, token) => {
  const response = await fetch(`${apiUrl}Rate/Connector/${connectorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch connector rates');
  }

  return data;
};

/**
 * Get paginated Rates
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pageSize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated rate data
 */
export const getPagedRates = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}Rate/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated rates');
  }

  return data;
};