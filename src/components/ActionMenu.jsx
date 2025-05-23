import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';

/**
 * Generic action menu renderer for entity management tables
 * 
 * @param {Object} _ - Unused parameter (from table column definition)
 * @param {Object} item - The data item being rendered
 * @param {Function} handleView - Function to view entity details
 * @param {Function|null} handleEdit - Function to edit entity (optional)
 * @param {Function} handleDelete - Function to delete entity
 * @param {string|null} actionMenuOpen - ID of currently open menu (if any)
 * @param {Function} setActionMenuOpen - Function to update menu open state
 * @param {Object} menuRefs - React refs object to track menu positions
 * @param {Object} options - Optional customization parameters
 * @returns {JSX.Element} Rendered action menu
 */
export const renderActionMenu = (
  _,
  item,
  handleView,
  handleEdit,
  handleDelete,
  actionMenuOpen,
  setActionMenuOpen,
  menuRefs,
  options = {}
) => {
  // Default options
  const {
    viewLabel = "View Details",
    editLabel = "Edit",
    deleteLabel = "Delete",
    customActions = [],
    showView = true,
    showEdit = true,
    showDelete = true
  } = options;

const positionDropdown = (ref) => {
  if (!ref) return {};

  const checkPosition = () => {
    if (ref && window) {
      const rect = ref.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Use a smaller threshold, or estimate menu height (e.g., 48px per item)
      const estimatedMenuHeight = 52 * (1 + customActions.length + (showView ? 1 : 0) + (showEdit ? 1 : 0) + (showDelete ? 1 : 0));
      return spaceBelow < estimatedMenuHeight;
    }
    return false;
  };

  const showAbove = checkPosition();

  if (showAbove) {
    return {
      bottom: '100%',
      right: 0,
      marginBottom: '8px',
    };
  }

  // Default position (below)
  return {
    top: '100%',
    right: 0,
    marginTop: '8px',
  };
};
  
  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setActionMenuOpen(actionMenuOpen === item ? null : item);
        }}
        className="cursor-pointer hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8"
        ref={(el) => menuRefs.current[`button_${item.id}`] = el}
      >
        <FiMoreVertical />
      </button>
      
      {actionMenuOpen === item && (
        <div 
          ref={(el) => menuRefs.current[item.id] = el}
          className="absolute w-48 bg-white rounded-md shadow-lg z-10 border border-stone-200"
          style={positionDropdown(menuRefs.current[`button_${item.id}`])}
        >
          <div className="py-1">
            {/* View action */}
            {showView && handleView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(item);
                  setActionMenuOpen(null);
                }}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-stone-100 w-full text-left"
              >
                <FiEye className="mr-2" /> {viewLabel}
              </button>
            )}
            
            {/* Edit action - Only show if handleEdit is provided */}
            {showEdit && handleEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                  setActionMenuOpen(null);
                }}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-stone-100 w-full text-left"
              >
                <FiEdit className="mr-2" /> {editLabel}
              </button>
            )}
            
            {/* Insert any custom actions before delete */}
            {customActions.map((action, index) => (
              <button
                key={`custom-action-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  action.handler(item);
                  setActionMenuOpen(null);
                }}
                className={`cursor-pointer flex items-center px-4 py-2 text-sm ${action.className || 'text-gray-700'} hover:bg-stone-100 w-full text-left transition-colors`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
            
            {/* Separator line before delete if there are other actions */}
            {(showView || showEdit || customActions.length > 0) && showDelete && handleDelete && (
              <hr className="my-1 border-stone-200" />
            )}
            
            {/* Delete action */}
            {showDelete && handleDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                  setActionMenuOpen(null);
                }}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                <FiTrash2 className="mr-2" /> {deleteLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Hook to handle action menu open/close behavior
 * Manages the open/close state and click outside behavior
 * 
 * @returns {Array} [actionMenuOpen, setActionMenuOpen, menuRefs] - State and refs for menu
 */
export const useActionMenu = () => {
  const [actionMenuOpen, setActionMenuOpen] = React.useState(null);
  const menuRefs = React.useRef({});
  
  // Handler for click outside menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside any menu
      if (actionMenuOpen !== null) {
        const currentMenuRef = menuRefs.current[actionMenuOpen.id || actionMenuOpen];
        const currentButtonRef = menuRefs.current[`button_${actionMenuOpen.id || actionMenuOpen}`];
        
        // Check if click is outside both the menu and its button
        if (
          currentMenuRef && 
          !currentMenuRef.contains(event.target) &&
          (!currentButtonRef || !currentButtonRef.contains(event.target))
        ) {
          setActionMenuOpen(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);
  
  return [actionMenuOpen, setActionMenuOpen, menuRefs];
};