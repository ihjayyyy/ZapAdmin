'use client';
import React, { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { getPagedCharging } from "@/services/ChargingSessions";
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import ChargingSessionsReport from "./ChargingSessionsReport";
import { chargingColumns, chargingSessionsFilterOptions, chargingSessionsFormFields } from "./ChargingSessionsConfig";
import { renderViewAction,renderDate,renderSessionDetails,renderStatus } from "./ChargingSessionsRenderers";
import { BsBattery } from "react-icons/bs";
import { FiTable, FiFileText } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

function ChargingSessionsPage() {
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'report'
  const [reportData, setReportData] = useState([]);

  const handleViewSession = (session) => {
    setCurrentSession(session);
    setShowViewModal(true);
  }

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }

  const handleClearFilters = () => {
    setFilters({});
    setShowFilterModal(false);
  }

  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters.chargingStatus) {
      filterArray.push(`chargingStatus=${additionalFilters.chargingStatus}`);
    }
    
    if (additionalFilters.stationName) {
      filterArray.push(`stationName=${additionalFilters.stationName}`);
    }
    
    if (additionalFilters.vehicleName) {
      filterArray.push(`vehicleName=${additionalFilters.vehicleName}`);
    }

    if (additionalFilters.startDate) {
      filterArray.push(`chargingStart>=${additionalFilters.startDate}`);
    }

    if (additionalFilters.endDate) {
      filterArray.push(`chargingEnd<=${additionalFilters.endDate}`);
    }

    if (isOperator && operatorId) {
      if (!filterArray.some(f => f.startsWith("operatorId="))) {
        filterArray.push(`operatorId=${operatorId}`);
      }
    }
    
    return filterArray;
  }, []);

  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: buildFilterString(pagingParams.filter, filters)
      };
      
      const response = await getPagedCharging(pagingData, token);
      
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load charging sessions');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString]);

  const fetchReportData = useCallback(async () => {
    try {
      const pagingData = {
        page: 1,
        pageSize: 1000, // Get all data for report
        sortField: 'id',
        sortAscending: true,
        filter: buildFilterString([], filters)
      };
      
      const response = await getPagedCharging(pagingData, token);
      setReportData(response.result || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load report data');
      setReportData([]);
    }
  }, [token, filters, buildFilterString]);

  const handleToggleView = (mode) => {
    setViewMode(mode);
    if (mode === 'report') {
      fetchReportData();
    }
  };

  const handleDownloadReport = () => {
    // Convert data to CSV and download
    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `charging-sessions-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    // Use browser's print-to-PDF functionality
    const printWindow = window.open('', '_blank');
    const reportContent = document.querySelector('.report-content');
    
    if (reportContent && printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Charging Sessions Report</title>
            <style>
              @page {
                size: landscape;
                margin: 0.5in;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                font-size: 12px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px; 
                font-size: 10px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 6px; 
                text-align: left; 
                white-space: nowrap;
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
                font-size: 11px;
              }
              .summary-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 15px; 
                margin: 15px 0; 
              }
              .summary-card { 
                padding: 12px; 
                border: 1px solid #ddd; 
                border-radius: 6px; 
                text-align: center;
              }
              .summary-title { 
                font-size: 10px; 
                color: #666; 
                margin-bottom: 4px; 
              }
              .summary-value { 
                font-size: 18px; 
                font-weight: bold; 
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px; 
              }
              .header h1 { 
                margin: 0; 
                font-size: 24px;
              }
              .header p { 
                margin: 5px 0; 
                color: #666; 
                font-size: 12px;
              }
              .filters { 
                background: #f9f9f9; 
                padding: 12px; 
                margin: 15px 0; 
                border-radius: 6px; 
              }
              .filter-tag { 
                display: inline-block; 
                background: #e3f2fd; 
                color: #1976d2; 
                padding: 3px 6px; 
                margin: 2px; 
                border-radius: 3px; 
                font-size: 10px; 
              }
              .footer {
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #ddd;
                text-align: center;
                font-size: 10px;
                color: #666;
              }
              /* Hide buttons and interactive elements */
              .print\\:hidden,
              button,
              .dropdown,
              .no-print {
                display: none !important;
              }
              @media print {
                body { margin: 0; }
                .print\\:hidden,
                button,
                .dropdown,
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${reportContent.innerHTML.replace(/<button[^>]*>.*?<\/button>/gi, '')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Station Name', 'Vehicle Name', 'Connector', 'Start Time', 'End Time', 'Energy (kWh)', 'Rate (kW)', 'Amount', 'Status'];
    const rows = data.map(session => [
      session.id,
      session.stationName || '',
      session.vehicleName || '',
      session.connector || '',
      session.chargingStart || '',
      session.chargingEnd || '',
      session.kilowatt || 0,
      session.chargingRate || 0,
      session.amount || 0,
      getStatusLabel(session.chargingStatus)
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
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

  const columns = chargingColumns(
    (session, item) => renderViewAction(session, item, handleViewSession),
    renderStatus,
    renderDate,
    renderSessionDetails,
  );

  const customTableProps = {
    title: "Charging Sessions",
    icon: BsBattery,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
  };

  return (
    <>
      {/* View Toggle */}
      <div className="mb-4 flex justify-between items-center print:hidden">
        <div className="flex bg-gray-100 rounded-lg p-1 mx-4">
          <button
            onClick={() => handleToggleView('table')}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-deepblue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiTable size={16} />
            Table View
          </button>
          <button
            onClick={() => handleToggleView('report')}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'report' 
                ? 'bg-deepblue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiFileText size={16} />
            Report View
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'table' ? (
        <DynamicTable {...customTableProps} />
      ) : (
        <ChargingSessionsReport 
          data={reportData}
          filters={filters}
          onDownloadCSV={handleDownloadReport}
          onDownloadPDF={handleDownloadPDF}
          onPrint={handlePrintReport}
        />
      )}
      
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={chargingSessionsFilterOptions()}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Charging Sessions"
      />

      {showViewModal && (
        <EntityFormModal
          entity={currentSession}
          formFields={chargingSessionsFormFields}
          onClose={() => setShowViewModal(false)}
          entityName="Charging Session"
          onView={true}
        />
      )}
    </>
  )
}

export default ChargingSessionsPage