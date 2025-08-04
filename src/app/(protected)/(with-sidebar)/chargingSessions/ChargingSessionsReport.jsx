import React, { useState, useRef, useEffect } from 'react';
import { FiDownload, FiPrinter, FiChevronDown } from 'react-icons/fi';

const ChargingSessionsReport = ({ data, filters, onDownloadCSV, onDownloadPDF, onPrint }) => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'In Progress', 
      2: 'Completed',
      3: 'Failed',
      4: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

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

  const totalEnergy = data.reduce((sum, session) => sum + (session.kilowatt || 0), 0);
  const totalAmount = data.reduce((sum, session) => sum + (session.amount || 0), 0);
  const completedSessions = data.filter(session => session.chargingStatus === 2).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm report-content">{/* Added report-content class */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Charging Sessions Report</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-deepblue-500 text-white rounded hover:bg-deepblue-700 transition-colors"
            >
              <FiDownload size={16} />
              Download
              <FiChevronDown size={14} className={`transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
            </button>
            
            {showDownloadOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onDownloadCSV();
                    setShowDownloadOptions(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                >
                  CSV Format
                </button>
                <button
                  onClick={() => {
                    onDownloadPDF();
                    setShowDownloadOptions(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                >
                  PDF Format
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onPrint}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-turquoise-500 text-white rounded hover:bg-turquoise-700 transition-colors"
          >
            <FiPrinter size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-deepblue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-deepblue-600">Total Sessions</h3>
          <p className="text-2xl font-bold text-deepblue-800">{data.length}</p>
        </div>
        <div className="bg-turquoise-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-turquoise-600">Completed</h3>
          <p className="text-2xl font-bold text-turquoise-800">{completedSessions}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Total Energy</h3>
          <p className="text-2xl font-bold text-yellow-800">{totalEnergy.toFixed(2)} kWh</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-800">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Applied Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Applied Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => (
              value && (
                <span key={key} className="px-2 py-1 bg-deepblue-100 text-deepblue-800 rounded text-sm">
                  {key}: {value}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Sessions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-deepblue-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">ID</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Station</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Vehicle</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Start Time</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">End Time</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Duration</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Energy (kWh)</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-deepblue-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((session, index) => (
              <tr key={session.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{session.id}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{session.stationName || '-'}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{session.vehicleName || '-'}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(session.chargingStart)}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(session.chargingEnd)}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{calculateDuration(session.chargingStart, session.chargingEnd)}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{session.kilowatt || 0}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">${(session.amount || 0).toFixed(2)}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    session.chargingStatus === 2 ? 'bg-green-100 text-green-800' :
                    session.chargingStatus === 1 ? 'bg-blue-100 text-blue-800' :
                    session.chargingStatus === 3 ? 'bg-red-100 text-red-800' :
                    session.chargingStatus === 4 ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusLabel(session.chargingStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No charging sessions found.
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>Report generated by ZapAdmin - EV Charging Management System</p>
      </div>
    </div>
  );
};

export default ChargingSessionsReport;
