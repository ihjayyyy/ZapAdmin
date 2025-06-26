/**
 * Validation functions for rate breakdown forms
 */

// Form validation function
export const validateRateBreakdownForm = (formData, setError) => {
  if (!formData.rateId) {
    setError('Rate is required');
    return false;
  }
  
  if (!formData.name || formData.name.trim() === '') {
    setError('Breakdown name is required');
    return false;
  }
  
  if (formData.rateType === undefined || formData.rateType === null || formData.rateType === '') {
    setError('Rate type is required');
    return false;
  }
  
  if (formData.amount === undefined || formData.amount === null || formData.amount === '' || parseFloat(formData.amount) < 0) {
    setError('Amount must be a valid number greater than or equal to 0');
    return false;
  }
  
  return true;
};
