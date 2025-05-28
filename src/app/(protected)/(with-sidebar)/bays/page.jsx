'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from 'react-toastify';
import { getAllStations, updateStation } from "@/services/StationServices";
import { getPagedChargingBays, createChargingBay,updateChargingBay,deleteChargingBay } from "@/services/ChargingBayServices";
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { bayColumns, bayFilterOptions, bayFormFields } from "./bayConfig";
import { renderStation, renderActions, renderStatus } from "./bayRenderers";
import { MdOutlineElectricCar } from "react-icons/md";
import { validateBayForm } from "./bayValidation";

function ChargingBaysPage() {
  const token = localStorage.getItem('token');
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

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters.stationId) {
      filterArray.push(`stationId=${additionalFilters.stationId}`);
    }
    
    if (additionalFilters.status !== undefined) {
      filterArray.push(`status=${additionalFilters.status}`);
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
    (_, item) => renderActions(_, item, handleViewBay, handleEditBay, handleDeleteConfirmation)
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
    </>
  )
}

export default ChargingBaysPage