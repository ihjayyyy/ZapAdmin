import React, { useState } from 'react';
import { Pencil, Trash2, MapPin, Phone, Mail, Eye } from 'lucide-react';

const Tooltip = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && content && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg whitespace-normal max-w-xs bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

const TruncatedCell = ({ text, maxWidth = "max-w-[150px]" }) => {
  // Always add tooltip regardless of text length
  const content = (
    <div className={`truncate ${maxWidth}`}>
      {text || ""}
    </div>
  );
  
  return (
    <Tooltip content={text}>
      {content}
    </Tooltip>
  );
};

const DynamicTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  isLoading,
  error,
  pagination = null,
  actions = true,
  emptyMessage = "No data found",

}) => {
  
  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="max-w-full rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border-collapse table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th 
                      key={col.key} 
                      className={`px-2 md:px-4 py-3 md:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${col.width || ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                  {/* Only add actions column if actions are enabled and column isn't already defined */}
                  {actions && !columns.some(col => col.key === 'actions') && (
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      <span className="sr-only md:not-sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data && data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col.key} className="px-2 md:px-4 py-3 md:py-4 text-sm">
                          {col.render ? (
                            <div className="flex items-center space-x-1">
                              {(col.key === 'Address' || col.key === 'address') && (
                                <MapPin size={16} className="text-gray-600 flex-shrink-0" />
                              )}
                              {(col.key === 'phone') && (
                                <Phone size={16} className="text-gray-600 flex-shrink-0" />
                              )}
                              {(col.key === 'email') && (
                                <Mail size={16} className="text-gray-600 flex-shrink-0" />
                              )}
                              <span>{col.render(row)}</span>
                            </div>
                          ) : (
                            <TruncatedCell 
                              text={row[col.key]} 
                              maxWidth={col.maxWidth || "max-w-[150px]"} 
                            />
                          )}
                        </td>
                      ))}
                      {/* Only add actions column if actions are enabled and column isn't already defined */}
                      {actions && !columns.some(col => col.key === 'actions') && (
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-sm font-medium w-20">
                          <div className="flex justify-end space-x-2">
                            {onView &&(
                              <button 
                                onClick={() => onView(row)} 
                                className="cursor-pointer text-amber-500 hover:text-amber-700"
                                aria-label={`Delete station ${row.name}`}
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                aria-label="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row.id)}
                                className="cursor-pointer text-red-600 hover:text-red-900"
                                aria-label="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={actions && !columns.some(col => col.key === 'actions') ? columns.length + 1 : columns.length} 
                      className="px-4 md:px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {pagination && (
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 space-y-2 md:space-y-0">
          {pagination}
        </div>
      )}
    </div>
  );
};

export default DynamicTable;