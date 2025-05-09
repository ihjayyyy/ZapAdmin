import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;
  
  // Determine the variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle size={24} className="text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white"
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-yellow-500" />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white" 
        };
      case 'info':
      default:
        return {
          icon: <AlertTriangle size={24} className="text-blue-500" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white"
        };
    }
  };
  
  const variantStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          {variantStyles.icon}
          <h3 className="ml-2 text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        {/* Body */}
        <div className="p-4">
          <p className="text-gray-700">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:-translate-y-0.5 cursor-pointer ${variantStyles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;