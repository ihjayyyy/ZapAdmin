export const validateUserForm = (formData, setError) => {
    if(!formData.userName || formData.userName.trim() === '') {
        setError('User Name is required');
        return false;
    }
    if(!formData.email || formData.email.trim() === '') {
        setError('Email is required');
        return false;
    }
    if(!formData.firstName || formData.firstName.trim() === '') {
        setError('First Name is required');
        return false;
    }
    if(!formData.lastName || formData.lastName.trim() === '') {
        setError('Last Name is required');
        return false;
    }
    if(!formData.password || formData.password.trim() === '') {
        setError('Password is required');
        return false;
    }
    if(formData.userType === undefined || formData.userType === null) {
        setError('User Type is required');
        return false;
    }

    return true;
}