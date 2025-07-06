import React from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { AiOutlineQrcode, AiOutlineDownload } from 'react-icons/ai';
import ActionButtons from '@/components/ActionButtons';
import StatusChip from '@/components/StatusChip';

// Custom renderer for price formatting
export const renderPrice = (price) => {
  return (
    <span className="font-semibold text-green-600">
      ₱{parseFloat(price).toFixed(2)}
    </span>
  );
};

export const renderStatus = (chargingStatus) => {
  return <StatusChip status={chargingStatus} />;
};

// QR Code renderer
export const renderQRCode = (qrCode, item, handleGenerateQRCode, handleViewQRCode) => {
  // Check if QR code exists - qrCode field from the table data
  const hasQRCode = qrCode && qrCode.trim() !== '';
  
  console.log('QR Code renderer - qrCode:', qrCode, 'hasQRCode:', hasQRCode, 'item:', item);
  
  return (
    <div className="flex items-center space-x-2">
      {hasQRCode ? (
        <button
          onClick={() => handleViewQRCode(item)}
          className="cursor-pointer text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
          title="View QR Code"
        >
          <AiOutlineQrcode size={18} />
        </button>
      ) : (
        <button
          onClick={() => handleGenerateQRCode(item)}
          className="cursor-pointer text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
          title="Generate QR Code"
        >
          <AiOutlineQrcode size={18} />
        </button>
      )}
    </div>
  );
};

// Inline action buttons using ActionButtons
export const renderActions = (_, item, handleViewConnector, handleDeleteConfirmation, handleGenerateQRCode) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewConnector(item), icon: FiEye, title: 'View' },
      { 
        onClick: () => handleGenerateQRCode(item), 
        icon: AiOutlineQrcode, 
        title: 'Generate QR Code', 
        className: 'hover:bg-green-100 text-green-600' 
      },
      { onClick: () => handleDeleteConfirmation(item), icon: FiTrash2, title: 'Delete', className: 'hover:bg-red-100 text-red-600' },
    ]}
  />
);