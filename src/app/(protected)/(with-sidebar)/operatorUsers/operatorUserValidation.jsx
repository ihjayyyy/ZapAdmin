export const validateUserOperatorForm = (formData, setError) => {
    if (!formData.operatorId) {
        setError('Operator is required');
        return false;
    }

    if (!formData.userId) {
        setError('User is required');
        return false;
    }
  
  
  return true;
};