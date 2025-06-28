'use client';
import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getPagedConnectors, 
  deleteConnector, 
  getConnectorTypes
} from '../../../../services/ConnectorServices';
import { getAllChargingBays } from '../../../../services/ChargingBayServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { connectorColumns, connectorFormFields, connectorFilterOptions } from './connectorConfig';
import { renderPrice, renderActions, renderStatus } from './connectorRenderers';
import { useAuth } from "@/context/AuthContext";
import { PiPlugChargingBold } from "react-icons/pi";


function ConnectorsPage() {
  const token = localStorage.getItem('token');
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentConnector, setCurrentConnector] = useState(null);
  const [filters, setFilters] = useState({});
  const [connectorTypeOptions, setConnectorTypeOptions] = useState([]);
  const [chargingBayOptions, setChargingBayOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  // Fetch connector types and charging bays for filter dropdowns
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        // Fetch connector types
        const types = await getConnectorTypes(token);
        const typeOptions = types.map(type => ({
          id: type,
          name: type
        }));
        setConnectorTypeOptions(typeOptions);

        // Fetch charging bays
        const chargingBays = await getAllChargingBays(token);
        const bayOptions = chargingBays.map(bay => ({
          id: bay.id,
          name: `Bay ${bay.id}${bay.stationId ? ` (Station ${bay.stationId})` : ''}`
        }));
        setChargingBayOptions(bayOptions);
        
      } catch (error) {
        toast.error(error.message || 'Failed to load filter data');
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Handle viewing connector details
  const handleViewConnector =(connector) => {
      setCurrentConnector(connector);
      setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (connector) => {
    setCurrentConnector(connector);
    setShowDeleteModal(true);
  };

  // Handle actual connector deletion
  const handleDeleteConnector = async () => {
    try {
      setLoading(true);
      await deleteConnector(currentConnector.id, token);
      toast.success('Connector successfully deleted');
      setShowDeleteModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete connector');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete confirmation
  const handleBulkDelete = (selectedIds) => {
    setSelectedConnectors(selectedIds);
    setShowBulkDeleteModal(true);
  };

  // Handle actual bulk deletion
  const handleConfirmBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedConnectors.map(id => deleteConnector(id, token)));
      toast.success(`${selectedConnectors.length} connectors successfully deleted`);
      setShowBulkDeleteModal(false);
      setSelectedConnectors([]);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete connectors');
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
  };

  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters.chargingBayId) {
      filterArray.push(`chargingBayId=${additionalFilters.chargingBayId}`);
    }
    
    if (additionalFilters.connectorType) {
      filterArray.push(`connectorType=${additionalFilters.connectorType}`);
    }

    if (additionalFilters.lastStatus) {
      filterArray.push(`lastStatus=${additionalFilters.lastStatus}`);
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
      
      const response = await getPagedConnectors(pagingData, token);
      console.log('Fetched connectors:', response);
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load connectors');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString,refreshTrigger]);

  const columns = connectorColumns(
    (_, item) => renderActions(_, item, handleViewConnector, handleDeleteConfirmation),
    renderPrice,
    renderStatus
  );

  const customTableProps = {
    title: "Connectors",
    icon: PiPlugChargingBold,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onBulkDelete: handleBulkDelete
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={connectorFilterOptions(connectorTypeOptions, chargingBayOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Connectors"
      />
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentConnector}
          formFields={connectorFormFields}
          onClose={() => setShowViewModal(false)}
          entityName="Connector"
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
          <p className="mb-4">
            Are you sure you want to delete the connector with ID <strong>{currentConnector?.id}</strong>?
          </p>
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm"><strong>Bay ID:</strong> {currentConnector?.chargingBayId}</p>
            <p className="text-sm"><strong>Type:</strong> {currentConnector?.connectorType}</p>
            <p className="text-sm"><strong>Price:</strong> ${parseFloat(currentConnector?.price || 0).toFixed(2)}</p>
          </div>
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
              onClick={handleDeleteConnector}
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
          <p className="mb-4">Are you sure you want to delete {selectedConnectors.length} connectors?</p>
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

export default ConnectorsPage;