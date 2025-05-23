/**
 * Validation functions for operator forms
 */

// Form validation function
export const validateOperatorForm = (formData, setError) => {
  if (!formData.name || formData.name.trim() === '') {
    setError('Operator name is required');
    return false;
  }
  
  if (!formData.address || formData.address.trim() === '') {
    setError('Address is required');
    return false;
  }
  
  if (!formData.phone || formData.phone.trim() === '') {
    setError('Phone number is required');
    return false;
  }
  
  if (!formData.email || formData.email.trim() === '') {
    setError('Email is required');
    return false;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return false;
  }
  
  if (!formData.contactPerson || formData.contactPerson.trim() === '') {
    setError('Contact person is required');
    return false;
  }
  
  return true;
};