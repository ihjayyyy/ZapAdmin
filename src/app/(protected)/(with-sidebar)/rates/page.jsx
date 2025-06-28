'use client';

import { useState, useEffect, useCallback } from 'react';
import { IoPricetagsOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import DynamicTable from '@/components/DynamicTable';
import DynamicModal from '@/components/DynamicModal';
import EntityFilterModal from '@/components/EntityFilterModal';
import EntityFormModal from '@/components/EntityFormModal';
import { useAuth } from '@/context/AuthContext';
import { getAllChargingBays } from '@/services/ChargingBayServices';
import { 
  createRate, 
  updateRate, 
  deleteRate, 
  getPagedRates
} from '@/services/RateServices';
import { 
  getRateBreakdownsByRate,
  getPagedRateBreakdownsByRate,
  createRateBreakdown,
  updateRateBreakdown,
  deleteRateBreakdown
} from '@/services/RateBreakdownServices';
import { rateColumns, rateFilterOptions, rateFormFields, rateBreakdownConfig } from './rateConfig';
import { validateRateForm } from './rateValidation';
import { renderChargingBay, renderStatus, renderActions } from './rateRenderers';
import { rateBreakdownFormFields, rateTypeOptions } from '../rateBreakdowns/rateBreakdownConfig';
import { validateRateBreakdownForm } from '../rateBreakdowns/rateBreakdownValidation';
import { useExpandableTable, createExpandedContent } from '@/components/ExpandableTable';

function RatePage() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [chargingBays, setChargingBays] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [filters, setFilters] = useState({});
  const [chargingBayOptions, setChargingBayOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRates, setSelectedRates] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  // Rate breakdown CRUD state
  const [showBreakdownFormModal, setShowBreakdownFormModal] = useState(false);
  const [showBreakdownViewModal, setShowBreakdownViewModal] = useState(false);
  const [showBreakdownDeleteModal, setShowBreakdownDeleteModal] = useState(false);
  const [currentBreakdown, setCurrentBreakdown] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);

  // Expandable table functionality
  const {
    expandedRows,
    relatedData: rateBreakdowns,
    loadingItems: loadingBreakdowns,
    pagination,
    currentPages,
    handleToggleExpand: baseHandleToggleExpand,
    handlePageChange,
    refreshRelatedData
  } = useExpandableTable((rateId, page, pageSize) => getPagedRateBreakdownsByRate(rateId, page, pageSize, token));

  // Wrapper to handle error messages
  const handleToggleExpand = async (rate) => {
    try {
      await baseHandleToggleExpand(rate);
    } catch (error) {
      toast.error(`Failed to load breakdowns for ${rate.name}: ${error.message}`);
    }
  };

  // Fetch all charging bays to map IDs to names
  useEffect(() => {
    const loadChargingBays = async () => {
      try {
        const chargingBayData = await getAllChargingBays(token);
        console.log('Charging Bay Data:', chargingBayData);
        // Create a mapping of charging bay ID to charging bay name
        const chargingBayMap = {};
        const options = [];
        chargingBayData.forEach(bay => {
          chargingBayMap[bay.id] = bay.code;
          // Store chargeBayId as number, not string
          options.push({ value: bay.id, label: bay.code });
        });
        setChargingBays(chargingBayMap);
        setChargingBayOptions(options);
      } catch (error) {
        toast.error(error.message || 'Failed to load charging bays');
      } finally {
        setLoading(false);
      }
    };

    loadChargingBays();
  }, [token]);

  // Handle adding a new rate
  const handleAddRate = () => {
    console.log(chargingBayOptions)
    setCurrentRate({
      chargingBayId: chargingBayOptions.length > 0 ? chargingBayOptions[0].value : null,
      name: '',
      status: true
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
      const updatedRate = { ...rate, status: !rate.status };
      await updateRate(rate.id, updatedRate, token);
      const statusText = rate.status ? 'deactivated' : 'activated';
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
      setLoading(true);
      
      if (formData.id) {
        await updateRate(formData.id, formData, token);
        toast.success('Rate updated successfully');
      } else {
        await createRate(formData, token);
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
    if (additionalFilters.chargingBayId) {
      filterArray.push(`chargingBayId=${parseInt(additionalFilters.chargingBayId, 10)}`);
    }
    if (additionalFilters.status !== undefined) {
      filterArray.push(`status=${additionalFilters.status}`);
    }

    if (isOperator && operatorId) {
      // For operators, we need to filter rates by their charging bays
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
    (chargingBayId) => renderChargingBay(chargingBayId, chargingBays),
    renderStatus,
    (_, item) => renderActions(_, item, handleViewRate, handleEditRate, handleDeleteConfirmation, handleToggleStatus, expandedRows, handleToggleExpand),
    (_, item) => createExpandedContent(rateBreakdownConfig)(
      _, 
      item, 
      expandedRows, 
      rateBreakdowns, 
      loadingBreakdowns,
      {
        onAdd: handleAddBreakdown,
        onView: handleViewBreakdown,
        onEdit: handleEditBreakdown,
        onDelete: handleDeleteBreakdown
      },
      pagination,
      currentPages,
      handlePageChange
    )
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

  // Rate Breakdown CRUD Handlers
  const handleAddBreakdown = (rate) => {
    setSelectedRate(rate);
    setCurrentBreakdown({
      rateId: rate.id,
      name: '',
      amount: 0,
      rateType: 0
    });
    setShowBreakdownFormModal(true);
  };

  const handleViewBreakdown = (breakdown) => {
    setCurrentBreakdown(breakdown);
    setShowBreakdownViewModal(true);
  };

  const handleEditBreakdown = (breakdown) => {
    setCurrentBreakdown(breakdown);
    setShowBreakdownFormModal(true);
  };

  const handleDeleteBreakdown = (breakdown) => {
    setCurrentBreakdown(breakdown);
    setShowBreakdownDeleteModal(true);
  };

  const handleBreakdownFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update existing breakdown
        await updateRateBreakdown(formData.id, formData, token);
        toast.success('Rate breakdown updated successfully');
      } else {
        // Create new breakdown
        await createRateBreakdown(formData, token);
        toast.success('Rate breakdown created successfully');
      }
      
      setShowBreakdownFormModal(false);
      
      // Refresh the rate breakdowns for the current rate
      if (selectedRate || currentBreakdown?.rateId) {
        const rateId = selectedRate?.id || currentBreakdown.rateId;
        await refreshRelatedData(rateId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save rate breakdown');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreakdownConfirm = async () => {
    try {
      setLoading(true);
      await deleteRateBreakdown(currentBreakdown.id, token);
      toast.success('Rate breakdown deleted successfully');
      setShowBreakdownDeleteModal(false);
      
      // Refresh the rate breakdowns for the current rate
      const rateId = currentBreakdown.rateId;
      await refreshRelatedData(rateId);
    } catch (error) {
      toast.error(error.message || 'Failed to delete rate breakdown');
    } finally {
      setLoading(false);
    }
  };

  const customTableProps = {
    title: "Rates",
    icon: IoPricetagsOutline,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddRate,
    onBulkDelete: handleBulkDelete,
    expandedRow: Array.from(expandedRows),
    onRowExpand: handleToggleExpand,
    renderExpandedRow: (rate) => {
      const breakdowns = rateBreakdowns[rate.id] || [];
      
      return (
        <div className="p-4 bg-gray-50 border-t">
          <h4 className="font-semibold mb-2">Rate Breakdowns</h4>
          
          {breakdowns.length === 0 ? (
            <p className="text-gray-500 text-sm">No breakdowns found for this rate.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {breakdowns.map(breakdown => (
                <li key={breakdown.id} className="text-sm">
                  {breakdown.description}: <strong>{breakdown.amount}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={rateFilterOptions(chargingBayOptions)}
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
          dropdownOptions={{ chargingBayId: chargingBayOptions }}
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
          dropdownOptions={{ chargingBayId: chargingBayOptions }}
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

      {/* Rate Breakdown Create/Edit Form Modal */}
      {showBreakdownFormModal && (
        <EntityFormModal
          entity={currentBreakdown}
          formFields={rateBreakdownFormFields}
          dropdownOptions={{ 
            rateType: rateTypeOptions,
            rateId: [{ value: selectedRate?.id || currentBreakdown?.rateId, label: selectedRate?.name || 'Selected Rate' }]
          }}
          onSubmit={handleBreakdownFormSubmit}
          onClose={() => setShowBreakdownFormModal(false)}
          validateForm={validateRateBreakdownForm}
          entityName="Rate Breakdown"
        />
      )}
      
      {/* Rate Breakdown View Modal */}
      {showBreakdownViewModal && (
        <EntityFormModal
          entity={currentBreakdown}
          formFields={rateBreakdownFormFields}
          dropdownOptions={{ 
            rateType: rateTypeOptions,
            rateId: [{ value: currentBreakdown?.rateId, label: 'Rate ID: ' + currentBreakdown?.rateId }]
          }}
          onClose={() => setShowBreakdownViewModal(false)}
          entityName="Rate Breakdown"
          onView={true}
        />
      )}
      
      {/* Rate Breakdown Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showBreakdownDeleteModal}
        onClose={() => setShowBreakdownDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the rate breakdown <strong>{currentBreakdown?.name}</strong>?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowBreakdownDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDeleteBreakdownConfirm}
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

export default RatePage;