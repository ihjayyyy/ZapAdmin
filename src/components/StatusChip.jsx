import React from 'react';
/**
 * StatusChip Component
 * --------------------
 * Displays a colored label or chip representing the status of an entity (e.g., active, pending, error).
 * Used in tables, cards, and detail views to visually indicate status.
 *
 * Example usage:
 * import StatusChip from '@/components/StatusChip';
 *
 * <StatusChip status="active" />
 */
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiHelpCircle, FiClock, FiPlay, FiPause } from 'react-icons/fi';

const statusMapping = {
  // For charging session numeric statuses
  0: { icon: <FiCheckCircle className="text-green-600" size={14} />, text: 'Available', textColor: 'text-green-600', bgColor: 'bg-green-100' },
  1: { icon: <FiClock className="text-yellow-600" size={14} />, text: 'Preparing', textColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  2: { icon: <FiPlay className="text-blue-600" size={14} />, text: 'Charging', textColor: 'text-blue-600', bgColor: 'bg-blue-100' },
  3: { icon: <FiPause className="text-gray-600" size={14} />, text: 'Suspended EVSE', textColor: 'text-gray-600', bgColor: 'bg-gray-100' },
  4: { icon: <FiPause className="text-indigo-600" size={14} />, text: 'Suspended EV', textColor: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  5: { icon: <FiClock className="text-purple-600" size={14} />, text: 'Finishing', textColor: 'text-purple-600', bgColor: 'bg-purple-100' },
  6: { icon: <FiClock className="text-orange-600" size={14} />, text: 'Reserved', textColor: 'text-orange-600', bgColor: 'bg-orange-100' },
  7: { icon: <FiXCircle className="text-red-600" size={14} />, text: 'Unavailable', textColor: 'text-red-600', bgColor: 'bg-red-100' },
  8: { icon: <FiXCircle className="text-red-700" size={14} />, text: 'Faulted', textColor: 'text-red-700', bgColor: 'bg-red-200' },
  9: { icon: <FiCheckCircle className="text-green-600" size={14} />, text: 'Completed', textColor: 'text-green-600', bgColor: 'bg-green-100' },
  // For connectors (or any string statuses)
  available: { icon: <FiCheckCircle className="text-green-500" size={14} />, text: 'Available', textColor: 'text-green-600', bgColor: 'bg-green-100' },
  unavailable: { icon: <FiXCircle className="text-red-500" size={14} />, text: 'Unavailable', textColor: 'text-red-600', bgColor: 'bg-red-100' },
  faulted: { icon: <FiAlertCircle className="text-orange-500" size={14} />, text: 'Faulted', textColor: 'text-orange-600', bgColor: 'bg-orange-100' },
  // Add missing status for operator requests
  pending: { icon: <FiClock className="text-yellow-500" size={14} />, text: 'Pending', textColor: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  approved: { icon: <FiCheckCircle className="text-green-500" size={14} />, text: 'Approved', textColor: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { icon: <FiXCircle className="text-red-500" size={14} />, text: 'Rejected', textColor: 'text-red-600', bgColor: 'bg-red-100' },
  unknown: { icon: <FiHelpCircle className="text-gray-500" size={14} />, text: 'Unknown', textColor: 'text-gray-600', bgColor: 'bg-gray-100' },
};

const StatusChip = ({ status }) => {
  // Determine the key based on type (number or string)
  const key = typeof status === 'number' ? status : status.toString().toLowerCase().trim();
  const config = statusMapping[key] || statusMapping.unknown;
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${config.bgColor} w-fit`}>
      {config.icon}
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};

export default StatusChip;