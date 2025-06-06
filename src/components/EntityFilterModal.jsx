import React, { useState } from 'react';
import DynamicModal from './DynamicModal';

/**
 * Generic filter modal for filtering any entity
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Function to close modal
 * @param {Array} props.filterOptions - Configuration for filter fields
 * @param {Object} props.currentFilters - Current filter values
 * @param {Function} props.onApplyFilters - Function called when filters are applied
 * @param {Function} props.onClearFilters - Function called when filters are cleared
 * @param {string} props.entityName - Name of the entity (Station, Operator, etc.)
 */
function EntityFilterModal({
  isOpen,
  onClose,
  filterOptions,
  currentFilters,
  onApplyFilters,
  onClearFilters,
  entityName = "Items"
}) {
  // Initialize filter state from current filters
  const [filters, setFilters] = useState(currentFilters || {});

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit button click
  const handleSubmit = () => {
    onApplyFilters(filters);
  };

  // Handle clear filters button click
  const handleClear = () => {
    // Reset local state to empty object
    setFilters({});
    // Call parent clear function
    onClearFilters();
  };

  // Render different filter fields
  const renderFilterField = (option) => {
    const { type, name, label, options } = option;
    
    switch (type) {
      case 'select':
        return (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {label}
            </label>
            <select
              value={filters[name] || ''}
              onChange={(e) => handleFilterChange(name, e.target.value)}
              className="input"
              aria-label={`Filter by ${label.toLowerCase()}`}
            >
              <option value="">{`All ${label}`}</option>
              {options.map((option, index) => {
                // Create a unique key by combining multiple possible identifiers
                const uniqueKey = option.id || option.value || option.userId || `${name}-option-${index}`;
                return (
                  <option key={uniqueKey} value={option.id || option.value || option.userId}>
                    {option.name || option.label}
                  </option>
                );
              })}
            </select>
          </div>
        );
        
      case 'radio':
        return (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {label}
            </label>
            <div className="flex gap-4">
              {options.map((option, index) => {
                // Create a unique key for radio options
                const uniqueKey = option.value !== undefined ? `${name}-${option.value}` : `${name}-radio-${index}`;
                return (
                  <label key={uniqueKey} className="flex items-center">
                    <input
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={filters[name] === option.value}
                      onChange={() => handleFilterChange(name, option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>
        );
              
      default:
        return null;
    }
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Filter ${entityName}`}
      size="lg"
    >
      {filterOptions.map(option => renderFilterField(option))}
      
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={handleClear}
          className="cancel-button"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          className="filled-button"
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
      </div>
    </DynamicModal>
  );
}

export default EntityFilterModal;