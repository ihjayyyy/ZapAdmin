import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Generates generic table column configuration
 * 
 * @param {Object} props
 * @param {Array} props.columnDefs - Column definitions
 * @param {string} props.sortField - Current sort field
 * @param {boolean} props.sortAscending - Whether sort is ascending
 * @param {Function} props.toggleSort - Function to toggle sort
 * @param {Object} props.cellRenderers - Custom cell renderers for different column types
 * @returns {Array} Table column configuration
 */
export function generateTableColumns({
  columnDefs,
  sortField,
  sortAscending,
  toggleSort,
  cellRenderers = {}
}) {
  // Generate sortable column header with arrow indicators
  const getSortableHeader = (key, label) => {
    const isSorted = sortField === key;
    
    return (
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => toggleSort(key)}
      >
        <span>{label}</span>
        {isSorted && (
          <span className="ml-1">
            {sortAscending ? (
              <ArrowUp size={14} className="text-white" />
            ) : (
              <ArrowDown size={14} className="text-white" />
            )}
          </span>
        )}
      </div>
    );
  };

  // Map column definitions to table columns
  return columnDefs.map(colDef => {
    const { key, label, width, sortable = true, type } = colDef;
    
    // Use custom renderer if available for this type
    const customRenderer = cellRenderers[type] || cellRenderers[key];
    
    return {
      key,
      label: sortable ? getSortableHeader(key, label) : label,
      width: width,
      sortable,
      render: customRenderer || (row => {
        // Default rendering based on type
        const value = row[key];
        
        if (value === undefined || value === null) {
          return <span className="text-gray-400">—</span>;
        }
        
        switch (type) {
          case 'boolean':
            return value ? 'Yes' : 'No';
          case 'date':
            return new Date(value).toLocaleDateString();
          case 'number':
            return value.toLocaleString();
          default:
            return (
              <div className="text-sm text-gray-600" title={value}>
                {value}
              </div>
            );
        }
      })
    };
  });
}