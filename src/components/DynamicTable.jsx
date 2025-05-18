import React, { useState } from 'react';
import { Pencil, Trash2, MapPin, Phone, Mail, Eye, MoreVertical } from 'lucide-react';

// Simple truncated text component that ensures text doesn't wrap to a second line
const TruncatedCell = ({ text, maxWidth = "max-w-[200px]" }) => {
  return (
    <div className={`block  truncate ${maxWidth}`}>
      {text || ""}
    </div>
  );
};

// Actions dropdown menu component - with smart position detection
const ActionsDropdown = ({ row, onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const dropdownRef = React.useRef(null);
  
  const toggleDropdown = () => {
    if (!isOpen) {
      // When opening, check if we're near the bottom of the viewport
      setTimeout(() => {
        if (dropdownRef.current) {
          const rect = dropdownRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          // If there's less than 150px below, show dropdown above
          setShowAbove(spaceBelow < 200);
        }
      }, 0);
    }
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when an action is clicked
  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };
  
  return (
    <div className="relative flex justify-center" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none"
        aria-label="More actions"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>
      
      {isOpen && (
        <>
          {/* Invisible overlay to detect clicks outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu with dynamic positioning */}
          <div className={`absolute ${showAbove ? 'bottom-full mb-1' : 'top-full mt-1'} right-0 z-20 w-36 bg-white rounded-md shadow-lg focus:outline-none`}>
            <div className="py-1">
              {onView && (
                <button
                  onClick={() => handleAction(() => onView(row))}
                  className="group flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <Eye size={16} className="mr-3 text-amber-500" />
                  <span>View</span>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => handleAction(() => onEdit(row))}
                  className="group flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <Pencil size={16} className="mr-3 text-blue-500" />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleAction(() => onDelete(row.id))}
                  className="group flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <Trash2 size={16} className="mr-3 text-red-600" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Modified mobile card view with improved truncation
const MobileCardView = ({ data, columns, onView, onEdit, onDelete, actions }) => {
  return (
    <div className="space-y-4">
      {data.map((row, index) => (
        <div key={row.id || index} className="bg-white rounded-lg shadow-md p-4">
          {/* Main row info with actions dropdown */}
          <div className="font-medium text-lg mb-3 flex justify-between items-center">
            <TruncatedCell text={row.name || row.id} maxWidth="max-w-[200px]" />
            
            {/* Status badge if available */}
            <div className="flex items-center space-x-2">
              {columns.some(col => col.key === 'active') && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  row.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {row.active ? 'Active' : 'Inactive'}
                </span>
              )}
              
              {/* Actions dropdown */}
              {actions && (
                <ActionsDropdown 
                  row={row} 
                  onView={onView} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-2 mb-4">
            {columns.map((col) => {
              // Skip status since we're showing it above
              if (col.key === 'active' || col.key === 'actions' || col.key === 'name') return null;
              
              const value = col.render ? col.render(row) : row[col.key];
              if (!value && value !== 0) return null;
              
              return (
                <div key={col.key} className="flex justify-between text-sm">
                  <div className="w-auto text-gray-500">{col.label}</div>
                  <div className="w-auto max-w-[65%]">
                    {col.key === 'address' && (
                      <div className="flex items-center">
                        <MapPin size={14} className="text-gray-600 mr-1 flex-shrink-0" />
                        <TruncatedCell text={value} maxWidth="max-w-full" />
                      </div>
                    )}
                    {col.key === 'phone' && (
                      <div className="flex items-center">
                        <Phone size={14} className="text-gray-600 mr-1 flex-shrink-0" />
                        <span>{value}</span>
                      </div>
                    )}
                    {col.key === 'email' && (
                      <div className="flex items-center">
                        <Mail size={14} className="text-gray-600 mr-1 flex-shrink-0" />
                        <TruncatedCell text={value} maxWidth="max-w-full" />
                      </div>
                    )}
                    {col.key !== 'address' && col.key !== 'phone' && col.key !== 'email' && (
                      <TruncatedCell text={value} maxWidth="max-w-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main table component with improved cell truncation
const DynamicTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  isLoading,
  error,
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
        <>
          {/* Mobile card view - only visible on small screens */}
          <div className="md:hidden">
            <MobileCardView 
              data={data} 
              columns={columns} 
              onView={onView} 
              onEdit={onEdit} 
              onDelete={onDelete}
              actions={actions}
            />
          </div>
          
          {/* Traditional table - hidden on small screens */}
          <div className="hidden md:block max-w-full rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-deep-blue-500">
                  <tr>
                    {columns.map((col) => (
                      <th 
                        key={col.key} 
                        className={`px-2 md:px-4 py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider ${col.width || ''}`}
                      >
                        {col.label}
                      </th>
                    ))}
                    {/* Only add actions column if actions are enabled and column isn't already defined */}
                    {actions && !columns.some(col => col.key === 'actions') && (
                      <th className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider w-16 text-center">
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
                          <td key={col.key} className="px-2 md:px-4 py-3 md:py-4 text-sm whitespace-nowrap">
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
                                <TruncatedCell 
                                  text={col.render(row)} 
                                  maxWidth={col.maxWidth || "max-w-[200px]"} 
                                />
                              </div>
                            ) : (
                              <TruncatedCell 
                                text={row[col.key]} 
                                maxWidth={col.maxWidth || "max-w-[200px]"} 
                              />
                            )}
                          </td>
                        ))}
                        {/* Only add actions column if actions are enabled and column isn't already defined */}
                        {actions && !columns.some(col => col.key === 'actions') && (
                          <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-center text-sm font-medium w-16">
                            <ActionsDropdown 
                              row={row} 
                              onView={onView} 
                              onEdit={onEdit} 
                              onDelete={onDelete} 
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={actions && !columns.some(col => col.key === 'actions') ? columns.length + 1 : columns.length} 
                        className="px-4 py-4 text-center text-sm text-gray-500"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicTable;