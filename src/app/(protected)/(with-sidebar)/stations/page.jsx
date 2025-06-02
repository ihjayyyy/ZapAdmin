'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from 'react-toastify';
import { 
  getPagedStations, 
  createStation, 
  updateStation, 
  deleteStation,
  toggleStationActivate,
} from '../../../../services/StationServices';
import { getAllOperators } from '../../../../services/OperatorServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { stationColumns, stationFormFields, stationFilterOptions } from './stationConfig';
import { renderOperator, renderLocation, renderStatus, renderActions } from './stationRenderers';
import { validateStationForm } from './stationValidation';
import { BsEvStation } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";

function StationPage() {
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const [operators, setOperators] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [filters, setFilters] = useState({});
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  // Fetch all operators to map IDs to names
  useEffect(() => {
    const loadOperators = async () => {
      try {
        const operatorData = await getAllOperators(token);
        // Create a mapping of operator ID to operator name
        const operatorMap = {};
        const options = [];
        operatorData.forEach(operator => {
          operatorMap[operator.id] = operator.name;
          options.push({ id: operator.id, name: operator.name });
        });
        setOperators(operatorMap);
        setOperatorOptions(options);
      } catch (error) {
        toast.error(error.message || 'Failed to load operators');
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, []);

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

  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    // Start with any existing filters
    const filterArray = [...(baseFilters || [])];

    // Add filter from additionalFilters if provided
    if (additionalFilters.operatorId) {
      filterArray.push(`operatorId=${additionalFilters.operatorId}`);
    }
    if (additionalFilters.active !== undefined) {
      filterArray.push(`active=${additionalFilters.active}`);
    }

    if (isOperator && operatorId) {
      if (!filterArray.some(f => f.startsWith("operatorId="))) {
        filterArray.push(`operatorId=${operatorId}`);
      }
    }
    
    return filterArray;
  }, [isOperator, operatorId]);

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
  }, [token, filters, buildFilterString, refreshTrigger]); // Added refreshTrigger to dependencies

  const columns = stationColumns(
    (operatorId) => renderOperator(operatorId, operators), 
    renderLocation, 
    renderStatus, 
    (_, item) => renderActions(_, item, handleViewStation, handleEditStation, handleDeleteConfirmation, handleToggleStatus)
  );

  const customTableProps = {
    title: "Stations",
    icon: BsEvStation,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddStation
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={stationFilterOptions(operatorOptions)}
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
    </>
  );
}

export default StationPage;