'use client';

import { useState, useEffect, useCallback } from 'react';
import { TbFileInvoice } from "react-icons/tb";
import { toast } from 'react-toastify';
import DynamicTable from '@/components/DynamicTable';
import DynamicModal from '@/components/DynamicModal';
import EntityFilterModal from '@/components/EntityFilterModal';
import EntityFormModal from '@/components/EntityFormModal';
import { useAuth } from '@/context/AuthContext';
import { getAllRates } from '@/services/RateServices';
import { 
  createRateBreakdown, 
  updateRateBreakdown, 
  deleteRateBreakdown, 
  getPagedRateBreakdowns
} from '@/services/RateBreakdownServices';
import { rateBreakdownColumns, rateTypeOptions } from './rateBreakdownConfig';
import { rateBreakdownFilterOptions } from './rateBreakdownConfig';
import { rateBreakdownFormFields } from './rateBreakdownConfig';
import { validateRateBreakdownForm } from './rateBreakdownValidation';
import { renderRate, renderAmount, renderRateType, renderActions } from './rateBreakdownRenderers';

function RateBreakdownPage() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRateBreakdown, setCurrentRateBreakdown] = useState(null);
  const [filters, setFilters] = useState({});
  const [rateOptions, setRateOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRateBreakdowns, setSelectedRateBreakdowns] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Fetch all rates to map IDs to names
  useEffect(() => {
    const loadRates = async () => {
      try {
        const rateData = await getAllRates(token);
        console.log('Rate Data:', rateData);
        // Create a mapping of rate ID to rate name
        const rateMap = {};
        const options = [];
        rateData.forEach(rate => {
          rateMap[rate.id] = rate.name;
          options.push({ value: rate.id, label: rate.name });
        });
        setRates(rateMap);
        setRateOptions(options);
      } catch (error) {
        toast.error(error.message || 'Failed to load rates');
      } finally {
        setLoading(false);
      }
    };

    loadRates();
  }, [token]);

  // Handle adding a new rate breakdown
  const handleAddRateBreakdown = () => {
    if (rateOptions.length === 0) {
      toast.error('Please wait for rates to load');
      return;
    }
    
    setCurrentRateBreakdown({
      rateId: rateOptions.length > 0 ? rateOptions[0].value : null,
      name: '',
      amount: 0,
      rateType: 0
    });
    setShowFormModal(true);
  };

  // Handle editing an existing rate breakdown
  const handleEditRateBreakdown = (rateBreakdown) => {
    setCurrentRateBreakdown(rateBreakdown);
    setShowFormModal(true);
  };

  // Handle viewing rate breakdown details
  const handleViewRateBreakdown = (rateBreakdown) => {
    setCurrentRateBreakdown(rateBreakdown);
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (rateBreakdown) => {
    setCurrentRateBreakdown(rateBreakdown);
    setShowDeleteModal(true);
  };

  // Handle actual rate breakdown deletion
  const handleDeleteRateBreakdown = async () => {
    try {
      setLoading(true);
      await deleteRateBreakdown(currentRateBreakdown.id, token);
      toast.success('Rate breakdown successfully deleted');
      setShowDeleteModal(false);
      // Trigger refresh by updating the refresh trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete rate breakdown');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Debug logging
      console.log('Form data being submitted:', formData);
      console.log('Rate type value:', formData.rateType, 'Type:', typeof formData.rateType);
      
      if (formData.id) {
        await updateRateBreakdown(formData.id, formData, token);
        toast.success('Rate breakdown updated successfully');
      } else {
        await createRateBreakdown(formData, token);
        toast.success('Rate breakdown created successfully');
      }
      
      setShowFormModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to save rate breakdown');
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
    if (additionalFilters.rateId) {
      filterArray.push(`rateId=${parseInt(additionalFilters.rateId, 10)}`);
    }
    if (additionalFilters.rateType !== undefined && additionalFilters.rateType !== null && additionalFilters.rateType !== '') {
      filterArray.push(`rateType=${additionalFilters.rateType}`);
    }

    if (isOperator && operatorId) {
      // For operators, we need to filter rate breakdowns by their rates
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
      
      const response = await getPagedRateBreakdowns(pagingData, token);
      
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load rate breakdowns');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString, refreshTrigger]);

  const columns = rateBreakdownColumns(
    (rateId) => renderRate(rateId, rates),
    renderAmount,
    renderRateType,
    (_, item) => renderActions(_, item, handleViewRateBreakdown, handleEditRateBreakdown, handleDeleteConfirmation)
  );

  // Add bulk delete handler
  const handleBulkDelete = (selectedIds) => {
    setSelectedRateBreakdowns(selectedIds);
    setShowBulkDeleteModal(true);
  };

  // Handle actual bulk deletion
  const handleConfirmBulkDelete = async () => {
    try {
      setLoading(true);
      // Delete all selected rate breakdowns
      await Promise.all(selectedRateBreakdowns.map(id => deleteRateBreakdown(id, token)));
      toast.success(`${selectedRateBreakdowns.length} rate breakdowns successfully deleted`);
      setShowBulkDeleteModal(false);
      setSelectedRateBreakdowns([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete rate breakdowns');
    } finally {
      setLoading(false);
    }
  };

  const customTableProps = {
    title: "Rate Breakdowns",
    icon: TbFileInvoice,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: loading || rateOptions.length === 0 ? null : handleAddRateBreakdown,
    onBulkDelete: handleBulkDelete,
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={rateBreakdownFilterOptions(rateOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Rate Breakdowns"
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentRateBreakdown}
          formFields={rateBreakdownFormFields}
          dropdownOptions={{ 
            rateId: rateOptions,
            rateType: rateTypeOptions
          }}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateRateBreakdownForm}
          entityName="Rate Breakdown"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentRateBreakdown}
          formFields={rateBreakdownFormFields}
          dropdownOptions={{ 
            rateId: rateOptions,
            rateType: rateTypeOptions
          }}
          onClose={() => setShowViewModal(false)}
          entityName="Rate Breakdown"
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
          <p className="mb-4">Are you sure you want to delete the rate breakdown <strong>{currentRateBreakdown?.name}</strong>?</p>
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
              onClick={handleDeleteRateBreakdown}
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
          <p className="mb-4">Are you sure you want to delete {selectedRateBreakdowns.length} rate breakdowns?</p>
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

export default RateBreakdownPage;
