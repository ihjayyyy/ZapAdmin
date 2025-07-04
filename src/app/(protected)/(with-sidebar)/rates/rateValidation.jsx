/**
 * Validation functions for rate forms
 */

// Form validation function
export const validateRateForm = (formData, setError) => {
  if (!formData.connectorId) {
    setError('Connector is required');
    return false;
  }
  
  if (!formData.name || formData.name.trim() === '') {
    setError('Rate name is required');
    return false;
  }
  
  return true;
};