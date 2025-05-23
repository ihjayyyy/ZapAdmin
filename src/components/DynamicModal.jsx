import React from 'react';
import { FaTimes } from 'react-icons/fa';

const DynamicModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' // 'sm', 'md', 'lg', 'xl'
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full'
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-y-auto max-h-[90vh]`}>
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 pr-8">{title}</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none absolute right-4 top-4 md:relative md:right-0 md:top-0"
            aria-label="Close"
          >
            <FaTimes size={20} /> {/* <-- Icon updated here */}
          </button>
        </div>
        <div className="modal-body p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DynamicModal;
