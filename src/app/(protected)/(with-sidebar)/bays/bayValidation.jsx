export const validateBayForm = (formData, setError) =>{
    if(!formData.stationId){
        setError('Station is required');
        return false;
    }

    if(!formData.code || formData.code.trim()===''){
        setError('Bay code is required');
        return false;
    }

    if(!formData.stationKey || formData.stationKey.trim() === ''){
        setError('Station key is required');
        return false
    }

    if(formData.maxPower === undefined || formData.maxPower === null ){
        setError('Max power is required')
        return false
        
    }
}