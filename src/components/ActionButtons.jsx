import React from 'react';

/**
 * ActionButtons Component
 * ----------------------
 * Renders a set of action buttons (icons) for table rows or UI actions.
 * Each button can have its own click handler, icon, tooltip, and custom styling.
 *
 * Example usage:
 * import ActionButtons from '@/components/ActionButtons';
 *
 * <ActionButtons
 *   actions={[
 *     { onClick: handleEdit, icon: EditIcon, title: 'Edit' },
 *     { onClick: handleDelete, icon: DeleteIcon, title: 'Delete' }
 *   ]}
 * />
 */
const ActionButtons = ({ actions }) => (
  <div className="flex gap-2">
    {actions.map(({ onClick, icon: Icon, title, className }, idx) => (
      <button
        key={idx}
        onClick={onClick}
        className={`cursor-pointer p-1 rounded ${className || 'hover:bg-stone-200'}`}
        title={title}
        type="button"
      >
        <Icon />
      </button>
    ))}
  </div>
);

export default ActionButtons;