import React, { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import DynamicTable from '../../components/DynamicTable';
import { createChargingBay, updateChargingBay, getPagedChargingBays, deleteChargingBay } from '../../services/ChargingBayServices';
import { getAllStations } from '../../services/StationServices';
import { getBayCellRenderers } from './BayCellRenders';
import EntityFormModal from '../../components/EntityFormModal';
import EntityFilterModal from '../../components/EntityFilterModal';
import EntitySearchBar from '../../components/EntitySearchBar';
import EntityPagination from '../../components/EntityPagination';
import { generateTableColumns } from '../../components/GenerateTableColumns';
import ConfirmationModal from '../../components/ConfirmationModal';
import { bayColumnDefs, getBayFormFields, getBayFilterOptions } from './BayConfig';

function ChargingBay() {
  // ===== STATE MANAGEMENT =====
  // Data states
  const [bays, setBays] = useState([]);
  const [totalBays, setTotalBays] = useState(0);
  const [stations, setStations] = useState([]);
  const [currentBay, setCurrentBay] = useState(null);
  const [bayToDelete, setBayToDelete] = useState(null);
  
  // UI states
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [onView, setOnView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortAscending, setSortAscending] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  // ===== DATA FETCHING =====
  const fetchBays = useCallback(async () => {
    try {
      setIsLoading(true);
      const pagingData = buildPagingData();
      const data = await getPagedChargingBays(pagingData, token);
      setBays(data.result);
      setTotalBays(data.Pagination.length);
    } catch (err) {
      toast.error(err.message || 'Failed to load charging bays');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortAscending, activeFilters, searchTerm, token]);

  const fetchStations = async () => {
    try {
      const data = await getAllStations(token);
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch Stations:", err);
      toast.error("Failed to fetch stations");
    }
  };

  // ===== EFFECTS =====
  // Initial data loading
  useEffect(() => {
    fetchStations();
  }, []);

  // Load bays when pagination, sorting or filters change
  useEffect(() => {
    fetchBays();
  }, [fetchBays]);

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ===== HELPER FUNCTIONS =====
  const buildPagingData = () => {
    const pagingData = {
      page: currentPage,
      pageSize,
      sortField,
      sortAscending,
      filter: []
    };

    if (searchTerm) {
      pagingData.filter.push(`searchTerm=${searchTerm}`);
    }
    
    if (filters.stationId) {
      pagingData.filter.push(`stationId=${filters.stationId}`);
    }

    if (filters.status !== undefined && filters.status !== '') {
      if (filters.status === 'true')
        pagingData.filter.push(`status=1`);
      else
        pagingData.filter.push(`status=0`);
    }
    
    return pagingData;
  };

  const getStationNameById = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : 'Unknown Station';
  };

  // ===== CRUD OPERATIONS =====
  const crudOperations = {
    handleCreate: async (newBay) => {
      try {
        setIsLoading(true);
        await createChargingBay(newBay, token);
        toast.success('Charging bay created successfully');
        await fetchBays();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to create charging bay');
        setIsLoading(false);
      }
    },

    handleUpdate: async (updatedBay) => {
      try {
        setIsLoading(true);
        await updateChargingBay(updatedBay.id, updatedBay, token);
        toast.success('Charging bay updated successfully');
        await fetchBays();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to update charging bay');
        setIsLoading(false);
      }
    },

    handleDelete: async () => {
      if (!bayToDelete) return;
      
      try {
        setIsLoading(true);
        await deleteChargingBay(bayToDelete, token);
        toast.success('Charging bay deleted successfully');
        await fetchBays();
        modalHandlers.closeDeleteModal();
      } catch (err) {
        toast.error(err.message || 'Failed to delete charging bay');
        setIsLoading(false);
      }
    },

    // Form submission handler
    handleSubmit: (bayData) => {
      if (bayData.id) {
        crudOperations.handleUpdate(bayData);
      } else {
        crudOperations.handleCreate(bayData);
      }
    }
  };

  // ===== MODAL HANDLERS =====
  const modalHandlers = {
    openCreateModal: () => {
      setCurrentBay({
        maxPower: 0,
        stationId: '',
        additionalInfo: '',
        status: 1
      });
      setOnView(false);
      setModalOpen(true);
    },

    openEditModal: (bay) => {
      setCurrentBay({ ...bay });
      setOnView(false);
      setModalOpen(true);
    },

    openViewModal: (bay) => {
      setCurrentBay({ ...bay });
      setOnView(true);
      setModalOpen(true);
    },

    closeModal: () => {
      setModalOpen(false);
    },

    openDeleteModal: (id) => {
      setBayToDelete(id);
      setDeleteModalOpen(true);
    },

    closeDeleteModal: () => {
      setBayToDelete(null);
      setDeleteModalOpen(false);
    },

    openFilterModal: () => {
      setFilterModalOpen(true);
    },

    closeFilterModal: () => {
      setFilterModalOpen(false);
    }
  };

  // ===== FILTER HANDLERS =====
  const filterHandlers = {
    handleFilterSubmit: (filterValues) => {
      setFilters(filterValues);
      const newActiveFilters = [];

      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== '' && value !== undefined) {
          newActiveFilters.push(`${key}=${value}`);
        }
      });

      setActiveFilters(newActiveFilters);
      setCurrentPage(1);
      modalHandlers.closeFilterModal();
      toast.info('Filters applied');
    },

    clearFilters: () => {
      setFilters({});
      setActiveFilters([]);
      modalHandlers.closeFilterModal();
      toast.info('Filters cleared');
    }
  };

  // ===== SORTING & PAGINATION HANDLERS =====
  const tableHandlers = {
    // Sorting handler
    toggleSort: (field) => {
      if (sortField === field) {
        setSortAscending(!sortAscending);
      } else {
        setSortField(field);
        setSortAscending(true);
      }
    },

    // Handle page size change
    handlePageSizeChange: (size) => {
      setPageSize(Number(size));
      setCurrentPage(1);
    }
  };

  // ===== UI CONFIGURATION =====
  const cellRenderers = getBayCellRenderers({
    getStationNameById
  });

  const columns = generateTableColumns({
    columnDefs: bayColumnDefs,
    sortField,
    sortAscending,
    toggleSort: tableHandlers.toggleSort,
    cellRenderers
  });

  // Get the form fields and filter options using the station data
  const formFields = getBayFormFields(stations);
  const filterOptions = getBayFilterOptions(stations);

  // ===== RENDER =====
  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Charging Bays</h1>
        <button
          onClick={modalHandlers.openCreateModal}
          className="filled-button"
        >
          <Plus size={16} />
          Add Bay
        </button>
      </div>

      {/* Search and Filter Section */}
      <EntitySearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCount={activeFilters.length}
        onFilterClick={modalHandlers.openFilterModal}
        entityName="Charging Bays"
      />

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {filter}
            </span>
          ))}
        </div>
      )}

      {/* Table Section */}
      <DynamicTable
        data={bays}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No charging bays found"
        onEdit={modalHandlers.openEditModal}
        onView={modalHandlers.openViewModal}
        onDelete={modalHandlers.openDeleteModal}
        sortField={sortField}
        sortAscending={sortAscending}
        onSort={tableHandlers.toggleSort}
      />

      {/* Pagination Section */}
      <EntityPagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalBays / pageSize)}
        pageSize={pageSize}
        totalItems={totalBays}
        itemCount={bays.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={tableHandlers.handlePageSizeChange}
        entityName="Charging Bays"
      />

      {/* Modals */}
      {modalOpen && (
        <EntityFormModal
          entity={currentBay}
          formFields={formFields}
          onView={onView}
          onSubmit={crudOperations.handleSubmit}
          onClose={modalHandlers.closeModal}
          entityName="Charging Bay"
        />
      )}

      <EntityFilterModal
        isOpen={filterModalOpen}
        onClose={modalHandlers.closeFilterModal}
        filterOptions={filterOptions}
        currentFilters={filters}
        onApplyFilters={filterHandlers.handleFilterSubmit}
        onClearFilters={filterHandlers.clearFilters}
        entityName="Charging Bays"
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={crudOperations.handleDelete}
        onClose={modalHandlers.closeDeleteModal}
        title="Delete Charging Bay"
        message="Are you sure you want to delete this charging bay? This action cannot be undone."
      />
    </div>
  );
}

export default ChargingBay;