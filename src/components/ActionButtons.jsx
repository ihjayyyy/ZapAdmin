import React from 'react';

const ActionButtons = ({ actions }) => (
  <div className="flex gap-2">
    {actions.map(({ onClick, icon: Icon, title, className }, idx) => (
      <button
        key={idx}
        onClick={onClick}
        className={`p-1 rounded ${className || 'hover:bg-stone-200'}`}
        title={title}
        type="button"
      >
        <Icon />
      </button>
    ))}
  </div>
);

export default ActionButtons;