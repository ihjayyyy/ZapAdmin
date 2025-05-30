const apiUrl = process.env.NEXT_PUBLIC_APIURL || '';

export const loginRequest = async (email, password) => {
  const response = await fetch(`${apiUrl}Auth/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const refreshTokenRequest = async (accessToken, refreshToken) => {
  const response = await fetch(`${apiUrl}Auth/refreshToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken, refreshToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Refresh token failed');
  }

  return data;
};

export const validateAccount = async (userId, otp) => {
  const response = await fetch(`${apiUrl}Auth/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Validation failed');
  }

  return data;
};

export const resendOTP = async (userId) => {
  const response = await fetch(`${apiUrl}Auth/resendOTP/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return data;
};
