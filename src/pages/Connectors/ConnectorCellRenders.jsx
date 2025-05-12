import React from 'react';

/**
 * Generates custom cell renderers for connector table
 * 
 * @param {Object} props
 * @param {Function} props.getConnectorTypeName - Function to get connector type name from ID
 * @returns {Object} Cell renderers for different column keys/types
 */
export function getConnectorCellRenderers() {
  return {


    // Custom renderer for price column to format as currency
    price: (row) => {
      return (
        <span className="text-gray-600">
          ₱{parseFloat(row.price).toFixed(2)}
        </span>
      );
    },

    // Custom renderer for charging pay ID
    chargingPayId: (row) => {
      return (
        <span className="text-gray-600">
          {row.chargingBayId}
        </span>
      );
    }
  };
}