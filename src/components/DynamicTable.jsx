import Link from "next/link";
import React, { useState, useEffect } from "react";
import { 
  FiArrowUpRight, 
  FiDollarSign, 
  FiMoreHorizontal, 
  FiChevronUp, 
  FiChevronDown, 
  FiSearch, 
  FiFilter,
  FiPlus
} from "react-icons/fi";

function DynamicTable({ 
  title, 
  icon: Icon = FiDollarSign,
  fetchData,
  columns = [], 
  initialPageSize = 5,
  onFilterClick = null,
  hasActiveFilters = false,
  onAddClick = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState(null);
  const [sortAscending, setSortAcceding] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const totalPages = Math.ceil(totalItems / pageSize);

  // Define columns that should not be sortable
  const nonSortableColumns = ['contact', 'location','actions'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchData({
            page: currentPage,
            pageSize,
            sortField,
            sortAscending,
            filter: searchTerm ? [`searchTerm=${searchTerm}`] : []
        });
        
        setData(result.data);
        setTotalItems(result.totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, pageSize, sortField, sortAscending, searchTerm, fetchData]);

  // Handle sorting
  const handleSort = (field) => {
    // Check if the column is sortable
    if (nonSortableColumns.includes(field)) {
      return; // Don't sort if column is in non-sortable list
    }

    if (sortField === field) {
      setSortAcceding(!sortAscending);
    } else {
      setSortField(field);
      setSortAcceding(true);
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Check if a column is sortable
  const isSortable = (columnKey) => {
    return !nonSortableColumns.includes(columnKey);
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    
    // Clear any existing timeouts
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set a new timeout to update search after typing stops
    window.searchTimeout = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300); // 300ms debounce
    
    // Update the input value immediately (but don't trigger search yet)
    e.target.value = value;
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="col-span-12 p-4 mx-4 rounded border border-stone-300">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-1.5 font-medium">
            <Icon /> {title}
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-2 py-1 text-sm border border-stone-300 rounded"
              defaultValue={searchTerm}
              onChange={handleSearch}
            />
            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-400" />
          </div>
          {onFilterClick && (
            <button 
              className={`cursor-pointer ${hasActiveFilters ? 'bg-deepblue-100 text-deepblue-700' : 'hover:bg-stone-200'} transition-colors grid place-content-center rounded text-sm size-8`}
              onClick={onFilterClick}
              aria-label="Filter data"
              title="Filter data"
            >
              <FiFilter className={hasActiveFilters ? "text-deepblue-700" : ""} />
            </button>
          )}
        </div>
        {onAddClick && (
          <button 
            className="cursor-pointer bg-deepblue-500 text-white transition-colors place-content-center rounded text-sm py-1.5 px-3 flex items-center gap-1"
            onClick={onAddClick}
            aria-label="Add new item"
            title="Add new item"
          >
            <FiPlus size={16} />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="overflow-y-auto border border-stone-200 rounded min-h-100 max-h-100" >
          <table className="w-full table-auto">
            <thead className="sticky top-0 z-10">
              <tr className="text-sm font-normal bg-deepblue-500 text-white">
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className={`text-start px-1.5 py-3 ${isSortable(column.key) ? 'cursor-pointer hover:bg-deepblue-400' : ''}`}
                    onClick={() => isSortable(column.key) && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {isSortable(column.key) && sortField === column.key && (
                        sortAscending ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deepblue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className={index % 2 ? "bg-deepblue-100 text-sm" : "text-sm"}>
                    {columns.map((column) => (
                      <td key={column.key} className="p-1.5">
                        {column.render ? (
                          column.render(item[column.key], item)
                        ) : (
                          item[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-stone-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">Select Page Size:</span>
          <div className="flex border border-stone-300 rounded overflow-hidden">
            {[5, 10, 15].map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`cursor-pointer px-3 py-1 text-sm ${
                  pageSize === size 
                    ? 'bg-deepblue-500 text-white' 
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="text-sm text-stone-500">
            Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </div>
          <div className="flex gap-1 ml-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className={`px-2 py-1 rounded text-sm ${currentPage === 1 || loading ? 'text-stone-400' : 'text-deepblue-500 hover:bg-stone-100'}`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                  className={`size-8 rounded text-sm ${pageNum === currentPage ? 'bg-deepblue-500 text-white' : 'text-deepblue-500 hover:bg-stone-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className={`px-2 py-1 rounded text-sm ${currentPage === totalPages || loading ? 'text-stone-400' : 'text-deepblue-500 hover:bg-stone-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicTable;