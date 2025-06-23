const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new rate
 * @param {Object} rateData - The rate data
 * @param {string} rateData.name - Name of the rate
 * @param {number} rateData.stationId - ID of the station
 * @param {boolean} rateData.isActive - Whether the rate is active
 * @param {number} rateData.rateType - Type of rate
 * @param {number} rateData.amount - Price amount
 * @param {string} rateData.unit - Unit of measurement
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created rate data
 */
export const createRate = async (rateData, token) => {
  // Convert to match the API expected format
  const apiData = {
    name: rateData.name,
    stationId: Number(rateData.stationId), // Ensure stationId is an integer
    isActive: rateData.isActive !== false, // Default to true if not specified
    // Explicitly handle 0 vs null/undefined
    rateType: rateData.rateType === 0 ? 0 : (Number(rateData.rateType) || 0),
    amount: parseFloat(rateData.amount), // Parse amount as float/decimal
    unit: rateData.unit
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
    stationId: Number(rateData.stationId), // Ensure stationId is an integer
    isActive: rateData.isActive !== false, // Default to true if not specified
    // Explicitly handle 0 vs null/undefined
    rateType: rateData.rateType === 0 ? 0 : (Number(rateData.rateType) || 0),
    amount: parseFloat(rateData.amount), // Parse amount as float/decimal
    unit: rateData.unit
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
 * Get rates by station ID
 * @param {string} stationId - ID of the station
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of rates for the station
 */
export const getRatesByStation = async (stationId, token) => {
  const response = await fetch(`${apiUrl}Rate/ByStation/${stationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch station rates');
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

/**
 * Toggle rate active status
 * @param {number} rateId - ID of the rate to toggle
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const toggleRateActive = async (rateId, token) => {
  const response = await fetch(`${apiUrl}Rate/ToggleActive/${rateId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to toggle rate activation');
  }

  return data;
};

/**
 * Get active rates
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of active rates
 */
export const getActiveRates = async (token) => {
  const response = await fetch(`${apiUrl}Rate/Active`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch active rates');
  }

  return data;
};