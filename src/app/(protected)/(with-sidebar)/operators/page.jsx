'use client';
import React, { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getPagedOperators, 
  createOperator, 
  updateOperator, 
  deleteOperator,  
} from '../../../../services/OperatorServices';
import { 
  getPagedStationsByOperator,
  createStation,
  updateStation,
  deleteStation
} from '../../../../services/StationServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { RiShieldUserLine } from 'react-icons/ri';
import { operatorColumns, operatorFormFields } from './operatorConfig';
import { renderContact, renderActions } from './operatorRenderers';
import { validateOperatorForm } from './operatorValidation';
import { useExpandableTable, createExpandedContent } from '@/components/ExpandableTable';
import { operatorStationConfig } from '@/components/ExpandableTableConfigs';
import { stationFormFields } from '../stations/stationConfig';
import { validateStationForm } from '../stations/stationValidation';

function OperatorsPage() {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Station modal states
  const [selectedOperatorForStation, setSelectedOperatorForStation] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [showStationFormModal, setShowStationFormModal] = useState(false);
  const [showStationViewModal, setShowStationViewModal] = useState(false);
  const [showStationDeleteModal, setShowStationDeleteModal] = useState(false);

  // Expandable table functionality for stations
  const {
    expandedRows,
    relatedData: operatorStations,
    loadingItems: loadingStations,
    pagination,
    currentPages,
    handleToggleExpand: baseHandleToggleExpand,
    handlePageChange,
    refreshRelatedData
  } = useExpandableTable((operatorId, page, pageSize) => getPagedStationsByOperator(operatorId, page, pageSize, token));

  // Wrapper to handle error messages
  const handleToggleExpand = async (operator) => {
    try {
      await baseHandleToggleExpand(operator);
    } catch (error) {
      toast.error(`Failed to load stations for ${operator.name}: ${error.message}`);
    }
  };
  
  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: pagingParams.filter || []
      };
      const response = await getPagedOperators(pagingData, token);
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load operators');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, refreshTrigger]);

  // Handle adding a new operator
  const handleAddOperator = () => {
    setCurrentOperator({
      name: '',
      address: '',
      phone: '',
      email: '',
      contactPerson: ''
    });
    setShowFormModal(true);
  };

  // Handle editing an existing operator
  const handleEditOperator = (operator) => {
      setCurrentOperator(operator);
      setShowFormModal(true);
  };

  // Handle viewing operator details
  const handleViewOperator = (operator) => {
      setCurrentOperator(operator);
      setShowFormModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (operator) => {
    setCurrentOperator(operator);
    setShowDeleteModal(true);
  };

  // Handle actual operator deletion
  const handleDeleteOperator = async () => {
    try {
      setLoading(true);
      await deleteOperator(currentOperator.id, token);
      toast.success('Operator successfully deleted');
      setShowDeleteModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete operator');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update existing operator
        await updateOperator(formData.id, formData, token);
        toast.success('Operator updated successfully');
      } else {
        // Create new operator
        await createOperator(formData, token);
        toast.success('Operator created successfully');
      }
      
      setShowFormModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to save operator');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete confirmation
  const handleBulkDelete = (selectedIds) => {
    setSelectedOperators(selectedIds);
    setShowBulkDeleteModal(true);
  };

  // Handle actual bulk deletion
  const handleConfirmBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedOperators.map(id => deleteOperator(id, token)));
      toast.success(`${selectedOperators.length} operators successfully deleted`);
      setShowBulkDeleteModal(false);
      setSelectedOperators([]);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete operators');
    } finally {
      setLoading(false);
    }
  };

  // Station CRUD Handlers
  const handleAddStation = (operator) => {
    setSelectedOperatorForStation(operator);
    setCurrentStation({
      operatorId: operator.id,
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      additionalInfo: ''
    });
    setShowStationFormModal(true);
  };

  const handleViewStation = (station) => {
    setCurrentStation(station);
    setShowStationViewModal(true);
  };

  const handleEditStation = (station) => {
    setCurrentStation(station);
    setShowStationFormModal(true);
  };

  const handleDeleteStation = (station) => {
    setCurrentStation(station);
    setShowStationDeleteModal(true);
  };

  const handleStationFormSubmit = async (formData) => {
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
      
      setShowStationFormModal(false);
      
      // Refresh the stations for the current operator
      if (selectedOperatorForStation || currentStation?.operatorId) {
        const operatorId = selectedOperatorForStation?.id || currentStation.operatorId;
        await refreshRelatedData(operatorId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save station');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStationConfirm = async () => {
    try {
      setLoading(true);
      await deleteStation(currentStation.id, token);
      toast.success('Station deleted successfully');
      setShowStationDeleteModal(false);
      
      // Refresh the stations for the current operator
      if (currentStation?.operatorId) {
        await refreshRelatedData(currentStation.operatorId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete station');
    } finally {
      setLoading(false);
    }
  };

  const columns = operatorColumns(
    renderContact,
    (_, item) => renderActions(_, item, handleViewOperator, handleEditOperator, handleDeleteConfirmation, expandedRows, handleToggleExpand),
    (_, item) => createExpandedContent(operatorStationConfig)(
      _, 
      item, 
      expandedRows, 
      operatorStations, 
      loadingStations,
      {
        onAdd: handleAddStation,
        onView: handleViewStation,
        onEdit: handleEditStation,
        onDelete: handleDeleteStation
      },
      pagination,
      currentPages,
      handlePageChange
    )
  );

  const customTableProps = {
    title: "Operators",
    icon: RiShieldUserLine,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onAddClick: handleAddOperator,
    onBulkDelete: handleBulkDelete
  };

  return (
    <>
      <DynamicTable
        {...customTableProps}
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentOperator}
          formFields={operatorFormFields}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateOperatorForm}
          entityName="Operator"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentOperator}
          formFields={operatorFormFields}
          onClose={() => setShowViewModal(false)}
          entityName="Operator"
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
          <p className="mb-4">Are you sure you want to delete the operator <strong>{currentOperator?.name}</strong>?</p>
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
              onClick={handleDeleteOperator}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>
      
      {/* Bulk Delete Modal */}
      <DynamicModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Confirm Bulk Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete {selectedOperators.length} operators?</p>
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

      {/* Station Create/Edit Form Modal */}
      {showStationFormModal && (
        <EntityFormModal
          entity={currentStation}
          formFields={stationFormFields}
          onSubmit={handleStationFormSubmit}
          onClose={() => setShowStationFormModal(false)}
          validateForm={validateStationForm}
          entityName="Station"
        />
      )}
      
      {/* Station View Details Modal */}
      {showStationViewModal && (
        <EntityFormModal
          entity={currentStation}
          formFields={stationFormFields}
          onClose={() => setShowStationViewModal(false)}
          entityName="Station"
          onView={true}
        />
      )}
      
      {/* Station Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showStationDeleteModal}
        onClose={() => setShowStationDeleteModal(false)}
        title="Confirm Delete Station"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the station <strong>{currentStation?.name}</strong>?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowStationDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDeleteStationConfirm}
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

export default OperatorsPage;