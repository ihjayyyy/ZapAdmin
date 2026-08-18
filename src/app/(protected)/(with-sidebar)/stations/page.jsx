'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from 'react-toastify';
import { 
  getPagedStations, 
  createStation, 
  updateStation, 
  deleteStation,
  toggleStationActivate,
} from '../../../../services/StationServices';
import { 
  getPagedChargingBays,
  createChargingBay,
  updateChargingBay,
  deleteChargingBay
} from '../../../../services/ChargingBayServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { stationColumns, stationFormFields, stationFilterOptions, stationChargingBayConfig } from './stationConfig';
import { renderOperator, renderLocation, renderStatus, renderActions } from './stationRenderers';
import { validateStationForm } from './stationValidation';
import { useExpandableTable, createExpandedContent } from '@/components/ExpandableTable';
import { bayFormFields } from '../bays/bayConfig';
import { validateBayForm } from '../bays/bayValidation';
import { BsEvStation } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
import { useOperatorFilter } from "@/context/OperatorFilterContext";

function StationPage() {
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const { operatorOptions, selectedOperatorId } = useOperatorFilter();
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [filters, setFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedStations, setSelectedStations] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Charging bay modal states
  const [selectedStationForBay, setSelectedStationForBay] = useState(null);
  const [currentBay, setCurrentBay] = useState(null);
  const [showBayFormModal, setShowBayFormModal] = useState(false);
  const [showBayViewModal, setShowBayViewModal] = useState(false);
  const [showBayDeleteModal, setShowBayDeleteModal] = useState(false);

  // Operator id -> name map, sourced from the global operator filter context
  // (which already scopes operators to what this user can see)
  const operators = useMemo(() => {
    const map = {};
    operatorOptions.forEach(op => { map[op.id] = op.name; });
    return map;
  }, [operatorOptions]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Expandable table functionality for charging bays
  const {
    expandedRows,
    relatedData: stationChargingBays,
    loadingItems: loadingBays,
    pagination,
    currentPages,
    handleToggleExpand: baseHandleToggleExpand,
    handlePageChange,
    refreshRelatedData
  } = useExpandableTable((stationId, page, pageSize) => {
    const pagingData = {
      page: page,
      pageSize: pageSize,
      sortField: 'id',
      sortAscending: true,
      filter: [`stationId=${stationId}`]
    };
    return getPagedChargingBays(pagingData, token);
  });

  // Wrapper to handle error messages
  const handleToggleExpand = async (station) => {
    try {
      await baseHandleToggleExpand(station);
    } catch (error) {
      toast.error(`Failed to load charging bays for ${station.name}: ${error.message}`);
    }
  };

  // Handle adding a new station
  const handleAddStation = () => {
    setCurrentStation({
      name: '',
      operatorId: '',
      address: '',
      latitude: 0,
      longitude: 0,
      additionalInfo: ''
    });
    setShowFormModal(true);
  };

  // Handle editing an existing station
  const handleEditStation = (station)=> {
    console.log(station);
      setCurrentStation(station);
      setShowFormModal(true);
  };

  // Handle viewing station details
  const handleViewStation = (station) => {
    setCurrentStation(station);
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (station) => {
    setCurrentStation(station);
    setShowDeleteModal(true);
  };

  // Handle station status toggle
  const handleToggleStatus = async (station) => {
    try {
      setLoading(true);
      await toggleStationActivate(station.id, token);
      const statusText = station.active ? 'deactivated' : 'activated';
      toast.success(`Station ${statusText} successfully`);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to toggle station status');
    } finally {
      setLoading(false);
    }
  };

  // Handle actual station deletion
  const handleDeleteStation = async () => {
    try {
      setLoading(true);
      await deleteStation(currentStation.id, token);
      toast.success('Station successfully deleted');
      setShowDeleteModal(false);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete station');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update existing station
        await updateStation(formData.id, formData, token);
        toast.success('Station updated successfully');
      } else {
        // Create new station
        await createStation(formData, token);
        toast.success('Station created successfully');
      }
      
      setShowFormModal(false);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to save station');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setShowFilterModal(false);
  };

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    // Start with any existing filters
    const filterArray = [...(baseFilters || [])];

    // Add filter from additionalFilters if provided (the page's own Filter modal)
    if (additionalFilters.operatorId) {
      filterArray.push(`operatorId=${additionalFilters.operatorId}`);
    }
    if (additionalFilters.active !== undefined) {
      filterArray.push(`active=${additionalFilters.active}`);
    }

    // Fall back to the global operator filter (topbar) only if the page-level
    // filter modal didn't already specify one - that takes precedence.
    if (selectedOperatorId && !filterArray.some(f => f.startsWith("operatorId="))) {
      filterArray.push(`operatorId=${selectedOperatorId}`);
    }
    
    return filterArray;
  }, [selectedOperatorId]);

  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: buildFilterString(pagingParams.filter, filters)
      };
      
      const response = await getPagedStations(pagingData, token);
      
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load stations');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString, refreshTrigger, selectedOperatorId]);

  const columns = stationColumns(
    (operatorId) => renderOperator(operatorId, operators), 
    renderLocation, 
    renderStatus, 
    (_, item) => renderActions(_, item, handleViewStation, handleEditStation, handleDeleteConfirmation, handleToggleStatus, expandedRows, handleToggleExpand),
    (_, item) => createExpandedContent(stationChargingBayConfig)(
      _, 
      item, 
      expandedRows, 
      stationChargingBays, 
      loadingBays,
      {
        onAdd: handleAddBay,
        onView: handleViewBay,
        onEdit: handleEditBay,
        onDelete: handleDeleteBay
      },
      pagination,
      currentPages,
      handlePageChange
    )
  );

  // Add bulk delete handler
  const handleBulkDelete = (selectedIds) => {
    setSelectedStations(selectedIds);
    setShowBulkDeleteModal(true);
  };

  // Handle actual bulk deletion
  const handleConfirmBulkDelete = async () => {
    try {
      setLoading(true);
      // Delete all selected stations
      await Promise.all(selectedStations.map(id => deleteStation(id, token)));
      toast.success(`${selectedStations.length} stations successfully deleted`);
      setShowBulkDeleteModal(false);
      setSelectedStations([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete stations');
    } finally {
      setLoading(false);
    }
  };

  // Charging Bay CRUD Handlers
  const handleAddBay = (station) => {
    setSelectedStationForBay(station);
    setCurrentBay({
      stationId: station.id,
      code: '',
      maxPower: 0,
      stationKey: ''
    });
    setShowBayFormModal(true);
  };

  const handleViewBay = (bay) => {
    setSelectedStationForBay(null);
    setCurrentBay(bay);
    setShowBayViewModal(true);
  };

  const handleEditBay = (bay) => {
    setSelectedStationForBay(null);
    setCurrentBay(bay);
    setShowBayFormModal(true);
  };

  const handleDeleteBay = (bay) => {
    setSelectedStationForBay(null);
    setCurrentBay(bay);
    setShowBayDeleteModal(true);
  };

  const bayStationOptions = selectedStationForBay?.id
    ? [{ id: selectedStationForBay.id, name: selectedStationForBay.name || `Station ${selectedStationForBay.id}` }]
    : currentBay?.stationId
      ? [{ id: currentBay.stationId, name: `Station ${currentBay.stationId}` }]
      : [];

  const bayFormFieldsForModal = selectedStationForBay?.id && !currentBay?.id
    ? bayFormFields.map(field =>
        field.name === 'stationId'
          ? {
              ...field,
              disabled: true,
              disabledMessage: 'Station is preselected from the parent station row.'
            }
          : field
      )
    : bayFormFields;

  const handleBayFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update existing bay
        await updateChargingBay(formData.id, formData, token);
        toast.success('Charging bay updated successfully');
      } else {
        // Create new bay
        await createChargingBay(formData, token);
        toast.success('Charging bay created successfully');
      }
      
      setShowBayFormModal(false);
      
      // Refresh the bays for the current station
      if (selectedStationForBay || currentBay?.stationId) {
        const stationId = selectedStationForBay?.id || currentBay.stationId;
        await refreshRelatedData(stationId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save charging bay');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBayConfirm = async () => {
    try {
      setLoading(true);
      await deleteChargingBay(currentBay.id, token);
      toast.success('Charging bay deleted successfully');
      setShowBayDeleteModal(false);
      
      // Refresh the bays for the current station
      if (currentBay?.stationId) {
        await refreshRelatedData(currentBay.stationId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete charging bay');
    } finally {
      setLoading(false);
    }
  };

  const customTableProps = {
    title: "Stations",
    icon: BsEvStation,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddStation,
    onBulkDelete: handleBulkDelete, // Make sure this is being passed
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={stationFilterOptions()}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Stations"
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentStation}
          formFields={stationFormFields}
          dropdownOptions={{ operatorId: operatorOptions }}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateStationForm}
          entityName="Station"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentStation}
          formFields={stationFormFields}
          dropdownOptions={{ operatorId: operatorOptions }}
          onClose={() => setShowViewModal(false)}
          entityName="Station"
          onView={true}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the station <strong>{currentStation?.name}</strong>?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDeleteStation}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>

      {/* Bulk Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Confirm Bulk Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete {selectedStations.length} stations?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleConfirmBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      </DynamicModal>

      {/* Charging Bay Create/Edit Form Modal */}
      {showBayFormModal && (
        <EntityFormModal
          entity={currentBay}
          formFields={bayFormFieldsForModal}
          dropdownOptions={{ stationId: bayStationOptions }}
          onSubmit={handleBayFormSubmit}
          onClose={() => {
            setShowBayFormModal(false);
            setSelectedStationForBay(null);
          }}
          validateForm={validateBayForm}
          entityName="Charging Bay"
        />
      )}
      
      {/* Charging Bay View Details Modal */}
      {showBayViewModal && (
        <EntityFormModal
          entity={currentBay}
          formFields={bayFormFields}
          onClose={() => setShowBayViewModal(false)}
          entityName="Charging Bay"
          onView={true}
        />
      )}
      
      {/* Charging Bay Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showBayDeleteModal}
        onClose={() => setShowBayDeleteModal(false)}
        title="Confirm Delete Charging Bay"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the charging bay <strong>{currentBay?.code}</strong>?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowBayDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDeleteBayConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>
    </>
  );
}

export default StationPage;