const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

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
export const getPagedCharging = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}Charging/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated charging transactions');
  }

  return data;
};

/**
 * Get Charging filtered by operatorId
 * @param {string} operatorId - ID of the operator
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of Charging for the specified operator
 */
export const getChargingByOperatorId = async (operatorId, token) => {
  const response = await fetch(`${apiUrl}Charging/ByOperator/${operatorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch Charging for operator');
  }

  return data;
};