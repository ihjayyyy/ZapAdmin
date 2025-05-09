import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

/**
 * Generates custom cell renderers for station table
 * 
 * @param {Object} props
 * @returns {Object} Cell renderers for different column keys/types
 */
export function getStationCellRenderers({ getOperatorNameById }) {
  return {
    // Custom renderer for operator column to show name instead of ID
    operatorId: (row) => {
      return <span className='text-gray-600'>{getOperatorNameById(row.operatorId)}</span>;
    },
    
    // Custom renderer for active status
    active: (row) => {
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      );
    },
  };
}