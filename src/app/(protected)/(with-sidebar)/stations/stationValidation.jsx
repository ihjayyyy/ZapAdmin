/**
 * Validation functions for station forms
 */

// Form validation function
export const validateStationForm = (formData, setError) => {
  if (!formData.operatorId) {
    setError('Operator is required');
    return false;
  }
  
  if (!formData.name || formData.name.trim() === '') {
    setError('Station name is required');
    return false;
  }
  
  if (!formData.address || formData.address.trim() === '') {
    setError('Address is required');
    return false;
  }
  
  if (formData.latitude === undefined || formData.latitude === null) {
    setError('Latitude is required');
    return false;
  }
  
  if (formData.longitude === undefined || formData.longitude === null) {
    setError('Longitude is required');
    return false;
  }
  
  return true;
};