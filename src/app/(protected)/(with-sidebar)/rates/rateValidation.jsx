/**
 * Validation functions for rate forms
 */

// Form validation function
export const validateRateForm = (formData, setError) => {
  if (!formData.stationId) {
    setError('Station is required');
    return false;
  }
  
  if (!formData.name || formData.name.trim() === '') {
    setError('Rate name is required');
    return false;
  }
  
  if (formData.rateType === undefined || formData.rateType === null) {
    setError('Rate type is required');
    return false;
  }
  
  if (formData.amount === undefined || formData.amount === null || formData.amount < 0) {
    setError('Amount must be a valid number greater than or equal to 0');
    return false;
  }

  
  return true;
};