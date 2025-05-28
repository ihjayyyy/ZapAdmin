'use client';
import React, { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { getPagedCharging } from "@/services/ChargingSessions";
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import { chargingColumns, chargingSessionsFilterOptions, chargingSessionsFormFields } from "./ChargingSessionsConfig";
import { renderViewAction,renderDate,renderSessionDetails,renderStatus } from "./ChargingSessionsRenderers";
import { BsBattery } from "react-icons/bs";

function ChargingSessionsPage() {
  const token = localStorage.getItem('token');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [filters, setFilters] = useState({});

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
      <DynamicTable {...customTableProps} />
      
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