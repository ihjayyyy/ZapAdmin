'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from 'react-toastify';
import { getAllStations, updateStation } from "@/services/StationServices";
import { getPagedChargingBays, createChargingBay,updateChargingBay,deleteChargingBay } from "@/services/ChargingBayServices";
import { getPagedConnectors } from "@/services/ConnectorServices";
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { useExpandableTable, createExpandedContent } from '@/components/ExpandableTable';
import { bayColumns, bayFilterOptions, bayFormFields, bayConnectorConfig } from "./bayConfig";
import { renderStation, renderActions, renderStatus } from "./bayRenderers";
import { MdOutlineElectricCar } from "react-icons/md";
import { validateBayForm } from "./bayValidation";
import { useAuth } from "@/context/AuthContext";

function ChargingBaysPage() {
  const token = localStorage.getItem('token');
  const { user } = useAuth(); 
  const [stations, setStations]=useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBay, setCurrentBay] = useState(null);
  const [filters, setFilters]=useState({});
  const [stationOptions, setStationOptions]= useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Connector modal states
  const [selectedBayForConnector, setSelectedBayForConnector] = useState(null);
  const [currentConnector, setCurrentConnector] = useState(null);
  const [showConnectorViewModal, setShowConnectorViewModal] = useState(false);
  const [showConnectorDeleteModal, setShowConnectorDeleteModal] = useState(false);

  // Expandable table functionality for connectors
  const {
    expandedRows,
    relatedData: bayConnectors,
    loadingItems: loadingConnectors,
    pagination,
    currentPages,
    handleToggleExpand: baseHandleToggleExpand,
    handlePageChange,
    refreshRelatedData
  } = useExpandableTable((bayId, page, pageSize) => {
    const pagingData = {
      filter: [`chargeBayId eq ${bayId}`],
      page: page,
      pagesize: pageSize,
      sortField: 'id',
      sortAscending: true
    };
    return getPagedConnectors(pagingData, token);
  });

  // Wrapper to handle error messages
  const handleToggleExpand = async (bay) => {
    try {
      await baseHandleToggleExpand(bay);
    } catch (error) {
      toast.error(`Failed to load connectors: ${error.message}`);
    }
  };

  useEffect(()=>{
    const loadStations = async () =>{
      try{
        const stationData = await getAllStations(token);

        const stationMap = {};
        const options = [];
        stationData.forEach(station=>{
          stationMap[station.id]=station.name;
          options.push({id:station.id, name:station.name});
        });
        setStations(stationMap);
        setStationOptions(options)
      }catch(error){
        toast.error(error.message || 'Failed to load Stations')
      }finally {
        setLoading(false);
      }
    };
    loadStations();
  }, []);

  const handleAddBay =() =>{
    setCurrentBay({
      stationI: '',
      code:'',
      maxPower:0,
      stationKey:'',
    })
    setShowFormModal(true);
  }

  const handleEditBay = (bay)=>{
    setCurrentBay(bay)
    setShowFormModal(true);
  }

  const handleViewBay =(bay)=>{
    setCurrentBay(bay)
    setShowFormModal(true);
  }

  const handleDeleteConfirmation = (bay) => {
    setCurrentBay(bay);
    setShowDeleteModal(true);
  };

  const handleDeleteBay = async () => {
    try {
      setLoading(true);
      await deleteChargingBay(currentBay.id, token);
      toast.success('Bay successfully deleted');
      setShowDeleteModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete bay');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData)=>{
    try{
      setLoading(true);
      if(formData.id){
        await updateChargingBay(formData.id, formData, token);
        toast.success('Bay updated successfully');
      }else{
        await createChargingBay(formData,token);
        toast.success('Bay created successfully')
      }
      setShowFormModal(false);
      setRefreshTrigger(prev => prev + 1);
    }catch (error) {
      toast.error(error.message || 'Failed to save station');
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Connector CRUD Handlers
  const handleViewConnector = (connector) => {
    setCurrentConnector(connector);
    setShowConnectorViewModal(true);
  };

  const handleDeleteConnector = (connector) => {
    setCurrentConnector(connector);
    setShowConnectorDeleteModal(true);
  };

  const handleDeleteConnectorConfirm = async () => {
    try {
      setLoading(true);
      // Note: We would need a deleteConnector function in ConnectorServices
      // For now, we'll just show a message
      toast.info('Connector deletion functionality would be implemented here');
      setShowConnectorDeleteModal(false);
      // Refresh related data
      refreshRelatedData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete connector');
    } finally {
      setLoading(false);
    }
  };

  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters.stationId) {
      filterArray.push(`stationId=${additionalFilters.stationId}`);
    }
    
    if (additionalFilters.status !== undefined) {
      filterArray.push(`status=${additionalFilters.status}`);
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
      
      const response = await getPagedChargingBays(pagingData, token);
      
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
  }, [token, filters, buildFilterString,refreshTrigger]);

  const columns = bayColumns(
    (stationId) => renderStation(stationId, stations),
    renderStatus,
    (_, item) => renderActions(_, item, handleViewBay, handleEditBay, handleDeleteConfirmation, expandedRows, handleToggleExpand),
    (_, item) => createExpandedContent(bayConnectorConfig)(
      _, 
      item, 
      expandedRows, 
      bayConnectors, 
      loadingConnectors,
      {
        onView: handleViewConnector,
        onDelete: handleDeleteConnector
      },
      pagination,
      currentPages,
      handlePageChange
    )
  )

  const customTableProps={
    title: "Charging Bays",
    icon: MdOutlineElectricCar,
    fetchData:fetchData,
    columns: columns,
    initialPageSize:10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddBay
  }
  return (
    <>
      <DynamicTable {...customTableProps} />
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={bayFilterOptions(stationOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Charging Bays"
      />

      {showFormModal && (
        <EntityFormModal
          entity={currentBay}
          formFields={bayFormFields}
          dropdownOptions={{ stationId: stationOptions }}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateBayForm}
          entityName="Charging Bays"
        />
      )}

      {showViewModal && (
        <EntityFormModal
          entity={currentBay}
          formFields={bayFormFields}
          dropdownOptions={{ stationId: stationOptions }}
          onClose={() => setShowViewModal(false)}
          entityName="Charging Bays"
          onView={true}
        />
      )}

      <DynamicModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the charging bay <strong>{currentBay?.name}</strong>?</p>
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
              onClick={handleDeleteBay}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>

      {/* Connector View Modal */}
      {showConnectorViewModal && (
        <EntityFormModal
          entity={currentConnector}
          formFields={[
            { name: 'id', label: 'Connector ID', type: 'number', readOnly: true },
            { name: 'connectorType', label: 'Connector Type', type: 'text', readOnly: true },
            { name: 'connectorName', label: 'Connector Name', type: 'text', readOnly: true },
            { name: 'price', label: 'Price', type: 'number', step: '0.01', readOnly: true },
            { name: 'lastStatus', label: 'Status', type: 'text', readOnly: true }
          ]}
          onClose={() => setShowConnectorViewModal(false)}
          entityName="Connector"
          onView={true}
        />
      )}

      {/* Connector Delete Modal */}
      <DynamicModal
        isOpen={showConnectorDeleteModal}
        onClose={() => setShowConnectorDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">Are you sure you want to delete the connector <strong>{currentConnector?.connectorType}</strong>?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowConnectorDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDeleteConnectorConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>
    </>
  )
}

export default ChargingBaysPage