const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';
/**
 * Get all user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of users
 */

export const getAllUsers = async (token) => {
  const response = await fetch(`${apiUrl}User`, {
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
 * Get paginated Users
 * @param {Object} pagingData - Paging and filter options
 * @param {Array<string>} pagingData.filter - List of filter strings
 * @param {number} pagingData.page - Page number (1-based)
 * @param {number} pagingData.pagesize - Number of items per page
 * @param {string} pagingData.sortField - Field to sort by
 * @param {boolean} pagingData.sortAscending - Sort order
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Paginated Users data
 */
export const getPagedUsers = async (pagingData, token) => {
  const response = await fetch(`${apiUrl}User/Paging`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(pagingData),
  });

  const data = await response.json();
  console.log('getPagedUsers response:', data);
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch paginated users');
  }

  return data;
};

export const createUser = async (userData, token) => {
  const payload = {
    ...userData,
    userType: Number(userData.userType),
  };

  const response = await fetch(`${apiUrl}User/Register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create station');
  }

  return data;
};