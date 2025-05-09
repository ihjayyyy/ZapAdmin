import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Generic pagination component
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Number of items per page
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemCount - Number of items on current page
 * @param {Function} props.onPageChange - Function called when page changes
 * @param {Function} props.onPageSizeChange - Function called when page size changes
 * @param {Array} props.pageSizeOptions - Available page size options
 * @param {string} props.entityName - Name of entity being paginated (stations, operators, etc.)
 */
function EntityPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  itemCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  entityName = "items"
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
      <div>
        Showing {itemCount} of {totalItems} <span className='capitalize'>{entityName}</span>
      </div>
      <div className="flex items-center gap-2">
        <select 
          className="cursor-pointer text-sm border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          aria-label="Items per page"
        >
          {pageSizeOptions.map(size => (
            <option className='cursor-pointer' key={size} value={size}>{size} per page</option>
          ))}
        </select>
        
        <div className="flex items-center">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`cursor-pointer p-1 rounded hover:bg-gray-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="mx-2 text-sm ">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <button 
            onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
            disabled={currentPage >= totalPages}
            className={`cursor-pointer p-1 rounded hover:bg-gray-200 ${currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : ''}`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default EntityPagination;
