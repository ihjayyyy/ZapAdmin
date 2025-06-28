const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new charging bay
 * @param {Object} chargingBayData - The charging bay data
 * @param {string} chargingBayData.stationId - ID of the station this bay belongs to
 * @param {number} chargingBayData.maxPower - Maximum power output of this charging bay in kW
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created charging bay data
 */
export const createChargingBay = async (chargingBayData, token) => {
  const response = await fetch(`${apiUrl}ChargingBay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(chargingBayData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create charging bay');
  }

  return data;
};

/**
 * Get all charging bays
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of charging bays
 */
export const getAllChargingBays = async (token) => {
  const response = await fetch(`${apiUrl}ChargingBay`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch charging bays');
  }

  return data;
};

/**
 * Get charging bay by ID
 * @param {string} chargingBayId - ID of the charging bay
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Charging bay data
 */
export const getChargingBayById = async (chargingBayId, token) => {
  const response = await fetch(`${apiUrl}ChargingBay/${chargingBayId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch charging bay');
  }

  return data;
};

/**
 * Update charging bay
 * @param {string} chargingBayId - ID of the charging bay to update
 * @param {Object} chargingBayData - Updated charging bay data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated charging bay data
 */
export const updateChargingBay = async (chargingBayId, chargingBayData, token) => {
  const { id:_id, ...dataWithoutId } = chargingBayData;
  const response = await fetch(`${apiUrl}ChargingBay/${chargingBayId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataWithoutId),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update charging bay');
  }

  return data;
};

/**
 * Delete charging bay
 * @param {string} chargingBayId - ID of the charging bay to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteChargingBay = async (chargingBayId, token) => {
  const response = await fetch(`${apiUrl}ChargingBay/${chargingBayId}`, {
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
 * Get paginated charging bays
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pagesize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated charging bay data
 */
export const getPagedChargingBays = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}ChargingBay/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated charging bays');
  }

  return data;
};

/**
 * Get charging bays filtered by operatorId
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of charging bays for the specified operator
 */
export const getChargingBaysByOperatorId = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}ChargingBay/ByOperator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch charging bays for operator');
  }

  return data;
};