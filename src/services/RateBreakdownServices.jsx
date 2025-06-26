const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

/**
 * Create a new rate breakdown
 * @param {Object} rateBreakdownData - The rate breakdown data
 * @param {number} rateBreakdownData.rateId - ID of the rate
 * @param {string} rateBreakdownData.name - Name of the rate breakdown
 * @param {number} rateBreakdownData.amount - Amount/price
 * @param {number} rateBreakdownData.rateType - Type of rate (enum)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - The created rate breakdown data
 */
export const createRateBreakdown = async (rateBreakdownData, token) => {
  // Convert to match the API expected format
  const apiData = {
    rateId: Number(rateBreakdownData.rateId),
    name: rateBreakdownData.name,
    amount: parseFloat(rateBreakdownData.amount),
    rateType: Number(rateBreakdownData.rateType)
  };

  const response = await fetch(`${apiUrl}RateBreakdown`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(apiData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create rate breakdown');
  }

  return data;
};

/**
 * Get all rate breakdowns
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of rate breakdowns
 */
export const getAllRateBreakdowns = async (token) => {
  const response = await fetch(`${apiUrl}RateBreakdown`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rate breakdowns');
  }

  return data;
};

/**
 * Get rate breakdown by ID
 * @param {string} rateBreakdownId - ID of the rate breakdown
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Rate breakdown data
 */
export const getRateBreakdownById = async (rateBreakdownId, token) => {
  const response = await fetch(`${apiUrl}RateBreakdown/${rateBreakdownId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rate breakdown');
  }

  return data;
};

/**
 * Update rate breakdown
 * @param {string} rateBreakdownId - ID of the rate breakdown to update
 * @param {Object} rateBreakdownData - Updated rate breakdown data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated rate breakdown data
 */
export const updateRateBreakdown = async (rateBreakdownId, rateBreakdownData, token) => {
  // Convert to match the API expected format
  const apiData = {
    rateId: Number(rateBreakdownData.rateId),
    name: rateBreakdownData.name,
    amount: parseFloat(rateBreakdownData.amount),
    rateType: Number(rateBreakdownData.rateType)
  };

  const response = await fetch(`${apiUrl}RateBreakdown/${rateBreakdownId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(apiData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update rate breakdown');
  }

  return data;
};

/**
 * Delete rate breakdown
 * @param {string} rateBreakdownId - ID of the rate breakdown to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const deleteRateBreakdown = async (rateBreakdownId, token) => {
  const response = await fetch(`${apiUrl}RateBreakdown/${rateBreakdownId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    // Only try to parse error response
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete rate breakdown');
  }

  // If response is OK (200), just return true or empty object
  return { success: true };
};

/**
 * Get rate breakdowns by rate ID
 * @param {string} rateId - ID of the rate
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of rate breakdowns for the rate
 */
export const getRateBreakdownsByRate = async (rateId, token) => {
  const response = await fetch(`${apiUrl}RateBreakdown/Rate/${rateId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rate breakdowns for rate');
  }

  return data;
};

/**
 * Get paginated Rate Breakdowns
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pageSize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated rate breakdown data
 */
export const getPagedRateBreakdowns = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}RateBreakdown/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated rate breakdowns');
  }

  return data;
};

/**
 * Get paginated rate breakdowns by rate ID
 * @param {string} rateId - ID of the rate
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated rate breakdown data
 */
export const getPagedRateBreakdownsByRate = async (rateId, page = 1, pageSize = 5, token) => {
  const pagingData = {
    page: page,
    pageSize: pageSize,
    sortField: 'id',
    sortAscending: true,
    filter: [`rateId=${parseInt(rateId, 10)}`]
  };

  const response = await fetch(`${apiUrl}RateBreakdown/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated rate breakdowns for rate');
  }

  return {
    data: data.result || [],
    totalItems: data.Pagination?.length || 0
  };
};
