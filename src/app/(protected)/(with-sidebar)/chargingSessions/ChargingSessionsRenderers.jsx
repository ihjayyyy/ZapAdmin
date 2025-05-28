import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiPlay, FiPause, FiEye } from 'react-icons/fi';
import ActionButtons from '@/components/ActionButtons'; // <-- Import ActionButtons

export const renderStatus = (chargingStatus) => {
    const statusConfig = {
        0: { icon: FiClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending' },
        1: { icon: FiPlay, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'In Progress' },
        2: { icon: FiCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed' },
        3: { icon: FiXCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
        4: { icon: FiPause, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Cancelled' }
    };

    const config = statusConfig[chargingStatus] || { 
        icon: FiClock, 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100', 
        label: `Unknown (${chargingStatus})` 
    };

    const IconComponent = config.icon;

    return (
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${config.bgColor} w-fit`}>
            <IconComponent className={config.color} size={14} />
            <span className={`text-sm font-medium ${config.color}`}>
                {config.label}
            </span>
        </div>
    );
};

export const renderDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return (
            <div className="flex flex-col">
                <span className="text-sm font-medium">
                    {date.toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                    {date.toLocaleTimeString()}
                </span>
            </div>
        );
    } catch (error) {
        return dateString;
    }
};

export const renderSessionDetails = (_, row) => {
    const duration = calculateDuration(row.chargingStart, row.chargingEnd);
    
    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm">
                <span className="font-medium">{row.kilowatt || 0} kWh</span>
                <span className="text-gray-500 ml-1">@ {row.chargingRate || 0} kW</span>
            </div>
            <div className="text-xs text-gray-500">
                Duration: {duration}
            </div>
            {row.amount > 0 && (
                <div className="text-xs font-medium text-green-600">
                    ${row.amount.toFixed(2)}
                </div>
            )}
        </div>
    );
};

// Refactored inline action button using ActionButtons
export const renderViewAction = (_, item, handleViewSession) => (
  <ActionButtons
    actions={[
      { onClick: () => handleViewSession(item), icon: FiEye, title: 'View' }
    ]}
  />
);

// Helper function to calculate duration
const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';
    
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        
        if (diffMs < 0) return '-';
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    } catch (error) {
        return '-';
    }
};