import React, { useState } from 'react';
import DynamicModal from './DynamicModal';

/**
 * Generic form modal component for creating/editing/viewing any entity
 * 
 * @param {Object} props
 * @param {Object} props.entity - Current entity data
 * @param {Array} props.formFields - Form field configurations
 * @param {Array} props.dropdownOptions - Options for dropdowns if needed
 * @param {boolean} props.isAdmin - Whether current user is admin
 * @param {string} props.error - Error message from API
 * @param {Function} props.onSubmit - Function called when form is submitted
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.validateForm - Custom validation function
 * @param {string} props.entityName - Name of the entity (Station, Operator, etc.)
 * @param {boolean} props.onView - Whether the form is in view-only mode
 */
function EntityFormModal({ 
  entity, 
  formFields, 
  dropdownOptions = {}, 
  error: propError, 
  onSubmit, 
  onClose,
  onView,
  validateForm: customValidateForm,
  entityName = "Entity"
}) {
  const [currentEntity, setCurrentEntity] = useState(entity);
  const [error, setError] = useState(propError);
  
  const handleInputChange = (e) => {
    if (onView) return; // Don't update state if in view mode
    
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Handle different input types
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      processedValue = e.target.checked;
    } else if (type === 'select-one') {
      // FIX: More explicit handling for select values
      // First check if it's an empty string (no selection)
      if (value === '') {
        processedValue = null;
      } else {
        // For numeric-looking values, convert to number
        const numericValue = Number(value);
        if (!isNaN(numericValue) && value.trim() !== '') {
          processedValue = numericValue;
        } else {
          // Keep as string if it's not numeric
          processedValue = value;
        }
      }
    }
    
    setCurrentEntity(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const defaultValidateForm = () => {
    // Check required fields
    const requiredFields = formFields
      .filter(field => field.required)
      .map(field => field.name);
      
    for (const field of requiredFields) {
      if (!currentEntity[field] && currentEntity[field] !== 0) {
        setError(`${field} is required`);
        return false;
      }
    }
    
    return true;
  };
  
  const validateForm = () => {
    // Use custom validation if provided, otherwise use default
    if (customValidateForm) {
      return customValidateForm(currentEntity, setError);
    }
    return defaultValidateForm();
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    console.log('EntityFormModal submitting:', currentEntity);
    
    if (validateForm()) {
      onSubmit(currentEntity);
    }
  };
  
  // Render different field types
  const renderField = (field) => {
    const { type, name, label, placeholder, disabled, required, options } = field;
    // Apply view-only mode by setting all fields to disabled if onView is true
    const isDisabled = onView || disabled;
    switch (type) {
        case 'select': {
          const selectOptions = dropdownOptions[name] || options || [];
          // Find the selected option to display its label in view mode
          const selectedOption = selectOptions.find(
            option => (option.id || option.userId || option.value) == currentEntity[name]
          );
          const displayValue = selectedOption ? (selectedOption.name || selectedOption.label) : '';
          
          return (
            <div className="mb-4" key={name}>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                {label} {required && !onView && '*'}
              </label>
              {onView ? (
                <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {displayValue || 'Not specified'}
                </div>
              ) : (
                <select
                  name={name}
                  value={currentEntity[name] !== undefined && currentEntity[name] !== null ? String(currentEntity[name]) : ''}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className="input"
                >
                  <option value="">{`Select ${label}`}</option>
                  {selectOptions.map((option, index) => {
                    // Create a unique key by combining multiple possible identifiers
                    const uniqueKey = option.id || option.value || option.userId || `${name}-option-${index}`;
                    
                    // FIX: More explicit value handling - prioritize 'value' property for form options
                    let optionValue;
                    if (option.hasOwnProperty('value')) {
                      optionValue = option.value;
                    } else if (option.hasOwnProperty('id')) {
                      optionValue = option.id;
                    } else if (option.hasOwnProperty('userId')) {
                      optionValue = option.userId;
                    } else {
                      optionValue = '';
                    }
                    
                    const optionLabel = option.label || option.name || optionValue;
                    
                    return (
                      <option key={uniqueKey} value={String(optionValue)}>
                        {optionLabel}
                      </option>
                    );
                  })}
                </select>
              )}
              {disabled && !onView && (
                <p className="text-xs text-gray-500 mt-1">
                  {field.disabledMessage}
                </p>
              )}
            </div>
          );
        }
          
        
      case 'textarea':
        return (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {label} {required && !onView && '*'}
            </label>
            {onView ? (
              <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 min-h-[100px] whitespace-pre-wrap">
                {currentEntity[name] || 'Not specified'}
              </div>
            ) : (
              <textarea
                name={name}
                value={currentEntity[name] || ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="input min-h-[100px]"
                disabled={isDisabled}
              />
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="mb-4 flex items-center" key={name}>
            {onView ? (
              <>
                <div className={`w-4 h-4 border rounded flex items-center justify-center mr-2 ${currentEntity[name] ? 'bg-blue-500 border-blue-600' : 'bg-gray-100 border-gray-300'}`}>
                  {currentEntity[name] && <span className="text-white text-xs">✓</span>}
                </div>
                <label className="text-gray-700 text-sm font-medium">{label}</label>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  name={name}
                  checked={!!currentEntity[name]}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={isDisabled}
                />
                <label className="text-gray-700 text-sm font-medium">
                  {label} {required && '*'}
                </label>
              </>
            )}
          </div>
        );
        
      default: // text, number, email, etc.
        return (
          <div className={field.gridClass || "mb-4"} key={name}>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {label} {required && !onView && '*'}
            </label>
            {onView ? (
              <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                {currentEntity[name] !== undefined && currentEntity[name] !== null && currentEntity[name] !== '' 
                  ? currentEntity[name] 
                  : 'Not specified'}
              </div>
            ) : (
              <input
                type={type || 'text'}
                name={name}
                value={currentEntity[name] ?? ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="input"
                step={type === 'number' ? field.step : undefined}
                disabled={isDisabled}
              />
            )}
          </div>
        );
    }
  };
  
  // Group fields in a grid if specified
  const renderFormFields = () => {
    let gridGroups = {};
    let standaloneFields = [];
    
    // First, group fields by their grid group
    formFields.forEach(field => {
      if (field.gridGroup) {
        if (!gridGroups[field.gridGroup]) {
          gridGroups[field.gridGroup] = [];
        }
        gridGroups[field.gridGroup].push(field);
      } else {
        standaloneFields.push(field);
      }
    });
    
    return (
      <>
        {/* Render grid groups */}
        {Object.entries(gridGroups).map(([groupName, fields]) => (
          <div key={groupName} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {fields.map(field => renderField({...field, gridClass: ""}))}
          </div>
        ))}
        
        {/* Render standalone fields */}
        {standaloneFields.map(field => renderField(field))}
      </>
    );
  };
  
  return (
    <DynamicModal 
      isOpen={true} 
      onClose={onClose} 
      title={onView ? `View ${entityName}` : entity?.id ? `Edit ${entityName}` : `Add New ${entityName}`}
      size="4xl" 
    >
      {(error || propError) && !onView && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || propError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            {onView ? "Close" : "Cancel"}
          </button>

          {!onView && (
            <button
              type="submit"
              className="filled-button"
            >
              {entity?.id ? "Save Changes" : `Create ${entityName}`}
            </button>
          )}
        </div>
      </form>
    </DynamicModal>
  );
}

export default EntityFormModal;