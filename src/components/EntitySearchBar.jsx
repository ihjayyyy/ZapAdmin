import React from 'react';
import { Filter } from 'lucide-react';

/**
 * Generic search bar component with optional filter button
 * 
 * @param {Object} props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Function called when search input changes
 * @param {number} props.filterCount - Number of active filters
 * @param {Function} props.onFilterClick - Function called when filter button is clicked
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {string} props.entityName - Name of entity to search (Stations, Operators, etc.)
 * @param {boolean} props.showFilter - Whether to show the filter button (default: true)
 */
function EntitySearchBar({ 
  searchTerm, 
  onSearchChange, 
  filterCount = 0, 
  onFilterClick,
  placeholder,
  entityName = "items",
  showFilter = true,
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className={`relative ${showFilter ? 'flex-grow mr-2' : 'w-full'}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder || `Search ${entityName.toLowerCase()}...`}
          className="input w-full pr-10"
          aria-label={`Search ${entityName.toLowerCase()}`}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
      </div>
      
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="outline-button flex items-center gap-1"
          aria-label={`Filter ${entityName.toLowerCase()}`}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">Filter</span>
          {filterCount > 0 && (
            <span 
              className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              aria-label={`${filterCount} active filters`}
            >
              {filterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default EntitySearchBar;