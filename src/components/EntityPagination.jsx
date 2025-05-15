import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Enhanced responsive pagination component
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
  // Store window width to adjust UI for smaller screens
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate which page buttons to show for pagination
  const getPageNumbers = () => {
    const isSmallScreen = windowWidth < 640;
    const pages = [];
    
    if (isSmallScreen) {
      // On small screens, just show current page with prev/next
      return pages;
    }
    
    if (totalPages <= 5) {
      // If we have 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate middle pages
      if (currentPage <= 3) {
        pages.push(2, 3, 4);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
      
      // Add ellipses where needed
      for (let i = 0; i < pages.length - 1; i++) {
        if (pages[i + 1] - pages[i] > 1) {
          pages.splice(i + 1, 0, '...');
          i++; // Skip the ellipsis we just added
        }
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  const isSmallScreen = windowWidth < 640;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
      {/* Text showing current range */}
      <div className="text-sm text-gray-600">
        Showing {itemCount} of {totalItems} <span className='capitalize'>{entityName}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {/* Page size selector */}
        <select 
          className="cursor-pointer text-sm border rounded px-2 py-1 mb-2 sm:mb-0"
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          aria-label="Items per page"
        >
          {pageSizeOptions.map(size => (
            <option className='cursor-pointer' key={size} value={size}>{size} per page</option>
          ))}
        </select>
        
        {/* Pagination controls */}
        <div className="flex items-center">
          {/* Previous page button */}
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
            aria-label="Previous page"
          >
            <ChevronLeft size={isSmallScreen ? 20 : 16} />
          </button>
          
          {/* Page number display */}
          {isSmallScreen ? (
            <span className="mx-2 text-sm whitespace-nowrap">
              Page {currentPage} of {totalPages || 1}
            </span>
          ) : (
            <>
              {pageNumbers.map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="mx-1 text-gray-500">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={`cursor-pointer w-8 h-8 mx-1 rounded-full flex items-center justify-center text-sm ${
                      currentPage === page 
                        ? 'bg-deep-blue-500 text-white' 
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              ))}
            </>
          )}
          
          {/* Next page button */}
          <button 
            onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
            disabled={currentPage >= totalPages}
            className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : ''}`}
            aria-label="Next page"
          >
            <ChevronRight size={isSmallScreen ? 20 : 16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntityPagination;