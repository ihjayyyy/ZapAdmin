import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiPlus, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import ActionButtons from './ActionButtons';

/**
 * Reusable Expandable Table Component
 * Handles expandable rows with CRUD operations for related entities
 */

// Expandable row button renderer
export const createExpandButton = (expandedRows, onToggleExpand) => (_, item) => (
  <button
    onClick={() => onToggleExpand(item)}
    className="p-1 hover:bg-gray-100 rounded transition-colors"
    title={expandedRows.has(item.id) ? 'Collapse' : 'Expand to see related items'}
  >
    {expandedRows.has(item.id) ? (
      <FiChevronDown className="text-gray-600" size={16} />
    ) : (
      <FiChevronRight className="text-gray-600" size={16} />
    )}
  </button>
);

// Expandable content renderer factory
export const createExpandedContent = (config) => (_, item, expandedRows, relatedData, loadingItems, crudHandlers, pagination, currentPages, onPageChange) => {
  if (!expandedRows.has(item.id)) {
    return null;
  }

  const items = relatedData[item.id] || [];
  const isLoading = loadingItems.has(item.id);
  const paginationInfo = pagination[item.id];
  const currentPage = currentPages[item.id] || 1;

  return (
    <div className="mt-2 bg-gray-50 rounded p-3 border-l-4 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">
          {config.title} for {item[config.parentNameField] || item.name}
          {paginationInfo && (
            <span className="ml-2 text-xs text-gray-500">
              ({paginationInfo.totalItems} total)
            </span>
          )}
        </h4>
        
        {crudHandlers?.onAdd && (
          <button
            onClick={() => crudHandlers.onAdd(item)}
            className="flex items-center gap-1 px-2 py-1 bg-deepblue-500 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            title={`Add new ${config.entityName}`}
          >
            <FiPlus size={12} />
            <span>Add {config.entityName}</span>
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading {config.entityName.toLowerCase()}s...</span>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="space-y-2">
            {items.map((relatedItem, index) => (
              <div 
                key={relatedItem.id || index} 
                className="bg-white rounded p-3 border border-gray-200 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {config.renderItem ? (
                      config.renderItem(relatedItem)
                    ) : (
                      <span className="font-medium text-gray-800">{relatedItem.name}</span>
                    )}
                  </div>
                  
                  {crudHandlers && (
                    <div className="flex items-center gap-1">
                      <ActionButtons
                        actions={[
                          crudHandlers.onView && { 
                            onClick: () => crudHandlers.onView(relatedItem), 
                            icon: FiEye, 
                            title: 'View',
                            className: 'hover:bg-gray-100 text-gray-600'
                          },
                          crudHandlers.onEdit && { 
                            onClick: () => crudHandlers.onEdit(relatedItem), 
                            icon: FiEdit, 
                            title: 'Edit', 
                            className: 'hover:bg-blue-100 text-blue-600' 
                          },
                          crudHandlers.onDelete && { 
                            onClick: () => crudHandlers.onDelete(relatedItem), 
                            icon: FiTrash2, 
                            title: 'Delete', 
                            className: 'hover:bg-red-100 text-red-600' 
                          }
                        ].filter(Boolean)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {paginationInfo && paginationInfo.totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Page {currentPage} of {paginationInfo.totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(item.id, currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => onPageChange(item.id, currentPage + 1)}
                  disabled={currentPage >= paginationInfo.totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-500 py-2">
          No {config.entityName.toLowerCase()}s found for this {config.parentEntityName.toLowerCase()}.
        </div>
      )}
    </div>
  );
};

/**
 * Hook for managing expandable table state and operations with pagination
 */
export const useExpandableTable = (fetchRelatedData, initialPageSize = 5) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [relatedData, setRelatedData] = useState({});
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [pagination, setPagination] = useState({});
  const [currentPages, setCurrentPages] = useState({});

  const handleToggleExpand = async (item) => {
    const newExpandedRows = new Set(expandedRows);
    
    if (expandedRows.has(item.id)) {
      // Collapse
      newExpandedRows.delete(item.id);
      setExpandedRows(newExpandedRows);
    } else {
      // Expand - fetch related data if not already loaded
      newExpandedRows.add(item.id);
      setExpandedRows(newExpandedRows);
      
      if (!relatedData[item.id] && fetchRelatedData) {
        await loadPage(item.id, 1);
      }
    }
  };

  const loadPage = async (parentId, page) => {
    setLoadingItems(prev => new Set([...prev, parentId]));
    try {
      const result = await fetchRelatedData(parentId, page, initialPageSize);
      
      setRelatedData(prev => ({
        ...prev,
        [parentId]: result.data || []
      }));
      
      setPagination(prev => ({
        ...prev,
        [parentId]: {
          totalItems: result.totalItems || 0,
          pageSize: initialPageSize,
          totalPages: Math.ceil((result.totalItems || 0) / initialPageSize)
        }
      }));
      
      setCurrentPages(prev => ({
        ...prev,
        [parentId]: page
      }));
    } catch (error) {
      console.error(`Failed to load related data for ${parentId}:`, error);
      // Remove from expanded if failed to load
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
      throw error; // Re-throw to let caller handle the error message
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
    }
  };

  const handlePageChange = async (parentId, newPage) => {
    await loadPage(parentId, newPage);
  };

  const refreshRelatedData = async (parentId) => {
    if (fetchRelatedData && relatedData[parentId]) {
      const currentPage = currentPages[parentId] || 1;
      await loadPage(parentId, currentPage);
    }
  };

  return {
    expandedRows,
    relatedData,
    loadingItems,
    pagination,
    currentPages,
    handleToggleExpand,
    handlePageChange,
    refreshRelatedData,
    setRelatedData
  };
};

export default {
  createExpandButton,
  createExpandedContent,
  useExpandableTable
};
