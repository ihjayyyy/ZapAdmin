export const validateRequestForm = (formData) => {
  const errors = {};

  // Validate operatorId
  if (!formData.operatorId) {
    errors.operatorId = 'Operator is required';
  }

  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate firstName
  if (!formData.firstName || formData.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  }

  // Validate lastName
  if (!formData.lastName || formData.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  }

  return errors;
};