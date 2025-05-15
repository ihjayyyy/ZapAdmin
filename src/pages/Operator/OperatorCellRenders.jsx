import React from 'react';
import { Mail, Phone } from 'lucide-react';

/**
 * Generates custom cell renderers for operator table
 * 
 * @returns {Object} Cell renderers for different column keys/types
 */
export function getOperatorCellRenders() {
  return {
    contact: (row) => {
      return (
        <div className="flex flex-col space-y-1">
          {row.email && (
            <div className="flex items-center space-x-2">
              <Mail size={14} className="text-gray-600 flex-shrink-0" />
              <span className='text-gray-600'
                title={row.email}
              >
                {row.email}
              </span>
            </div>
          )}
          
          {row.phone && (
            <div className="flex items-center space-x-2">
              <Phone size={14} className="text-gray-600 flex-shrink-0" />
              <span className='text-gray-600' 
                title={row.phone}
              >
                {row.phone}
              </span>
            </div>
          )}
        </div>
      );
    },

  };
}