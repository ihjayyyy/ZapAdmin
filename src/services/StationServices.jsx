const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new station
 * @param {Object} stationData - The station data
 * @param {string} stationData.operatorId - ID of the station operator
 * @param {string} stationData.name - Name of the station
 * @param {string} stationData.address - Address of the station
 * @param {number} stationData.latitude - Latitude coordinate
 * @param {number} stationData.longitude - Longitude coordinate
 * @param {string} stationData.additionalInfo - Additional information about the station
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created station data
 */
export const createStation = async (stationData, token) => {
  const response = await fetch(`${apiUrl}Station`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(stationData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create station');
  }

  return data;
};

/**
 * Get all stations
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of stations
 */
export const getAllStations = async (token) => {
  const response = await fetch(`${apiUrl}Station`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch stations');
  }

  return data;
};

/**
 * Get station by ID
 * @param {string} stationId - ID of the station
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Station data
 */
export const getStationById = async (stationId, token) => {
  const response = await fetch(`${apiUrl}Station/${stationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch station');
  }

  return data;
};

/**
 * Update station
 * @param {string} stationId - ID of the station to update
 * @param {Object} stationData - Updated station data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated station data
 */
export const updateStation = async (stationId, stationData, token) => {
  const { id:_id, active: _active, ...dataToSend } = stationData;
  const response = await fetch(`${apiUrl}Station/${stationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dataToSend),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update station');
  }

  return data;
};

/**
 * Delete station
 * @param {string} stationId - ID of the station to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteStation = async (stationId, token) => {
  const response = await fetch(`${apiUrl}Station/${stationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete station');
  }

  return data;
};

/**
 * Get stations by operator ID
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of stations for the operator
 */
export const getStationsByOperator = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Station/operator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch operator stations');
  }

  return data;
};

/**
 * Get paginated Stations
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pagesize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated station data
 */
export const getPagedStations = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}Station/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated stations');
  }

  return data;
};

/**
 * Toggle station activation status
 * @param {number} stationId - ID of the station to toggle
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const toggleStationActivate = async (stationId, token) => {
  const response = await fetch(`${apiUrl}Station/ToggleActivate/${stationId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to toggle station activation');
  }

  return data;
};

/**
 * Get Stations filtered by operatorId
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of Stations for the specified operator
 */
export const getStationByOperatorId = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Station/ByOperator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch Stations for operator');
  }

  return data;
};