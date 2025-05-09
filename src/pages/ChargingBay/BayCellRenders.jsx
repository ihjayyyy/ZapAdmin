import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

/**
 * Generates custom cell renderers for charging bay table
 * 
 * @param {Object} props
 * @param {Function} props.getStationNameById - Function to get station name from ID
 * @returns {Object} Cell renderers for different column keys/types
 */
export function getBayCellRenderers({getStationNameById }) {
  return {

    // Custom renderer for station column to show name instead of ID
    stationId: (row) => {
      return <span className='text-gray-600'>{getStationNameById(row.stationId)}</span>;
    },

    maxPower: (row) => {
      return <span className='text-gray-600'>{row.maxPower}kW</span>;
    },

    active: (row) => {
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status ? 'Active' : 'Inactive'}
        </span>
      );
    },
  };
}