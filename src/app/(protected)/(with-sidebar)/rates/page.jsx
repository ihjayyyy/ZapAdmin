'use client';

import { useState, useEffect, useCallback } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { toast } from 'react-toastify';
import DynamicTable from '@/components/DynamicTable';
import DynamicModal from '@/components/DynamicModal';
import EntityFilterModal from '@/components/EntityFilterModal';
import EntityFormModal from '@/components/EntityFormModal';
import { useAuth } from '@/context/AuthContext';
import { getAllStations } from '@/services/StationServices';
import { 
  createRate, 
  updateRate, 
  deleteRate, 
  getPagedRates, 
  toggleRateActive 
} from '@/services/RateServices';
import { rateColumns } from './rateConfig';
import { rateFilterOptions } from './rateConfig';
import { rateFormFields } from './rateConfig';
import { validateRateForm } from './rateValidation';
import { renderStation, renderAmount, renderStatus, renderActions } from './rateRenderers';

function RatePage() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [stations, setStations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [filters, setFilters] = useState({});
  const [stationOptions, setStationOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRates, setSelectedRates] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Fetch all stations to map IDs to names
  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationData = await getAllStations(token);
        // Create a mapping of station ID to station name
        const stationMap = {};
        const options = [];
        stationData.forEach(station => {
          stationMap[station.id] = station.name;
          // Store stationId as number, not string
          options.push({ value: station.id, label: station.name });
        });
        setStations(stationMap);
        setStationOptions(options);
      } catch (error) {
        toast.error(error.message || 'Failed to load stations');
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [token]);

  // Handle adding a new rate
  const handleAddRate = () => {
    setCurrentRate({
      stationId: stationOptions.length > 0 ? stationOptions[0].value : null,
      name: '',
      rateType: 0, // Default to Standard
      amount: 0,
      unit: 'kWh', // Default unit
      isActive: true
    });
    setShowFormModal(true);
  };

  // Handle editing an existing rate
  const handleEditRate = (rate) => {
    setCurrentRate(rate);
    setShowFormModal(true);
  };

  // Handle viewing rate details
  const handleViewRate = (rate) => {
    setCurrentRate(rate);
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (rate) => {
    setCurrentRate(rate);
    setShowDeleteModal(true);
  };

  // Handle rate status toggle
  const handleToggleStatus = async (rate) => {
    try {
      setLoading(true);
      await toggleRateActive(rate.id, token);
      const statusText = rate.isActive ? 'deactivated' : 'activated';
      toast.success(`Rate ${statusText} successfully`);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to toggle rate status');
    } finally {
      setLoading(false);
    }
  };

  // Handle actual rate deletion
  const handleDeleteRate = async () => {
    try {
      setLoading(true);
      await deleteRate(currentRate.id, token);
      toast.success('Rate successfully deleted');
      setShowDeleteModal(false);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete rate');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      console.log("Before fixing:", formData); // Debug log
      
      // Create a new object with fixed rateType
      const fixedFormData = {
        ...formData,
        // Explicitly handle 0 vs null/undefined
        rateType: formData.rateType === 0 ? 0 : (formData.rateType || 0)
      };
      
      console.log("After fixing:", fixedFormData); // Debug log
      
      setLoading(true);
      
      if (fixedFormData.id) {
        await updateRate(fixedFormData.id, fixedFormData, token);
        toast.success('Rate updated successfully');
      } else {
        await createRate(fixedFormData, token);
        toast.success('Rate created successfully');
      }
      
      setShowFormModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to save rate');
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
    if (additionalFilters.stationId) {
      filterArray.push(`stationId=${parseInt(additionalFilters.stationId, 10)}`);
    }
    if (additionalFilters.rateType !== undefined) {
      filterArray.push(`rateType=${additionalFilters.rateType}`);
    }
    if (additionalFilters.unit) {
      filterArray.push(`unit=${additionalFilters.unit}`);
    }
    if (additionalFilters.isActive !== undefined) {
      filterArray.push(`isActive=${additionalFilters.isActive}`);
    }

    if (isOperator && operatorId) {
      // For operators, we need to filter rates by their stations
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
      
      const response = await getPagedRates(pagingData, token);
      
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load rates');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString, refreshTrigger]);

  const columns = rateColumns(
    (stationId) => renderStation(stationId, stations),
    renderAmount,
    renderStatus,
    (_, item) => renderActions(_, item, handleViewRate, handleEditRate, handleDeleteConfirmation, handleToggleStatus)
  );

  // Add bulk delete handler
  const handleBulkDelete = (selectedIds) => {
    setSelectedRates(selectedIds);
    setShowBulkDeleteModal(true);
  };

  // Handle actual bulk deletion
  const handleConfirmBulkDelete = async () => {
    try {
      setLoading(true);
      // Delete all selected rates
      await Promise.all(selectedRates.map(id => deleteRate(id, token)));
      toast.success(`${selectedRates.length} rates successfully deleted`);
      setShowBulkDeleteModal(false);
      setSelectedRates([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete rates');
    } finally {
      setLoading(false);
    }
  };

  const customTableProps = {
    title: "Rates",
    icon: BsCurrencyDollar,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddRate,
    onBulkDelete: handleBulkDelete,
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={rateFilterOptions(stationOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Rates"
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentRate}
          formFields={rateFormFields}
          dropdownOptions={{ stationId: stationOptions }}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateRateForm}
          entityName="Rate"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentRate}
          formFields={rateFormFields}
          dropdownOptions={{ stationId: stationOptions }}
          onClose={() => setShowViewModal(false)}
          entityName="Rate"
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
          <p className="mb-4">Are you sure you want to delete the rate <strong>{currentRate?.name}</strong>?</p>
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
              onClick={handleDeleteRate}
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
          <p className="mb-4">Are you sure you want to delete {selectedRates.length} rates?</p>
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
    </>
  );
}

export default RatePage;