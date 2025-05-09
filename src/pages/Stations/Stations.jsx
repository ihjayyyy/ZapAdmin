import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import DynamicTable from '../../components/DynamicTable';
import {
  createStation,
  updateStation,
  deleteStation,
  getStationsByOperator,
  getPagedStations
} from '../../services/StationServices';
import { getAllOperators } from '../../services/OperatorServices';

import EntityFormModal from '../../components/EntityFormModal';
import EntityFilterModal from '../../components/EntityFilterModal';
import EntitySearchBar from '../../components/EntitySearchBar';
import EntityPagination from '../../components/EntityPagination';
import { generateTableColumns } from '../../components/GenerateTableColumns';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getStationCellRenderers } from './StationCellRenders';
import { getStationFormFields, getStationFilterOptions, stationColumnDefs } from './StationConfig';

function Stations() {
  // ===== STATE MANAGEMENT =====
  // Data states
  const [stations, setStations] = useState([]);
  const [totalStations, setTotalStations] = useState(0);
  const [operators, setOperators] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [stationToDelete, setStationToDelete] = useState(null);
  
  // UI states
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [onView, setOnView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortAscending, setSortAscending] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);

  // User and authentication information
  const token = localStorage.getItem('token');
  const userOperatorId = localStorage.getItem('operatorId');
  const isAdmin = !userOperatorId;

  // ===== DATA FETCHING =====
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (userOperatorId) {
        // Operator-specific view
        const data = await getStationsByOperator(userOperatorId, token);
        setStations(data);
        setTotalStations(data.length);
      } else {
        // Admin view with pagination and filters
        const pagingData = buildPagingData();
        const data = await getPagedStations(pagingData, token);
        setStations(data.result);
        setTotalStations(data.Pagination.length);
      }

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load stations');
      toast.error(err.message || 'Failed to load stations');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortAscending, activeFilters, searchTerm, userOperatorId, token]);

  const fetchOperators = async () => {
    try {
      const data = await getAllOperators(token);
      setOperators(data);
    } catch (err) {
      console.error("Failed to fetch operators:", err);
      toast.error("Failed to fetch operators");
    }
  };

  // ===== EFFECTS =====
  // Initial data loading
  useEffect(() => {
    fetchOperators();
  }, []);

  // Load stations when pagination, sorting or filters change
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

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

    if (filters.operatorId) {
      pagingData.filter.push(`operatorId=${filters.operatorId}`);
    }

    if (filters.active !== undefined && filters.active !== '') {
      pagingData.filter.push(`active=${filters.active}`);
    }
    
    return pagingData;
  };

  const getOperatorNameById = (operatorId) => {
    const operator = operators.find(op => op.id === operatorId);
    return operator ? operator.name : 'Unknown Operator';
  };

  // ===== CRUD OPERATIONS =====
  const crudOperations = {
    handleCreate: async (newStation) => {
      try {
        setIsLoading(true);
        const stationWithOperator = {
          ...newStation,
          operatorId: newStation.operatorId || userOperatorId
        };
        await createStation(stationWithOperator, token);
        toast.success('Station created successfully');
        await fetchStations();
        modalHandlers.closeModal();
      } catch (err) {
        setError(err.message || 'Failed to create station');
        toast.error(err.message || 'Failed to create station');
        setIsLoading(false);
      }
    },

    handleUpdate: async (updatedStation) => {
      try {
        setIsLoading(true);
        await updateStation(updatedStation.id, updatedStation, token);
        toast.success('Station updated successfully');
        await fetchStations();
        modalHandlers.closeModal();
      } catch (err) {
        setError(err.message || 'Failed to update station');
        toast.error(err.message || 'Failed to update station');
        setIsLoading(false);
      }
    },

    handleDelete: async () => {
      if (!stationToDelete) return;
      
      try {
        setIsLoading(true);
        await deleteStation(stationToDelete, token);
        toast.success('Station deleted successfully');
        await fetchStations();
        modalHandlers.closeDeleteModal();
      } catch (err) {
        setError(err.message || 'Failed to delete station');
        toast.error(err.message || 'Failed to delete station');
        setIsLoading(false);
      }
    },

    // Form submission handler
    handleSubmit: (stationData) => {
      if (stationData.id) {
        crudOperations.handleUpdate(stationData);
      } else {
        crudOperations.handleCreate(stationData);
      }
    }
  };

  // ===== MODAL HANDLERS =====
  const modalHandlers = {
    openCreateModal: () => {
      setCurrentStation({
        name: '',
        address: '',
        latitude: 0,
        longitude: 0,
        additionalInfo: '',
        operatorId: userOperatorId || '',
        active: true
      });
      setOnView(false);
      setModalOpen(true);
      setError('');
    },

    openEditModal: (station) => {
      setCurrentStation({ ...station });
      setOnView(false);
      setModalOpen(true);
      setError('');
    },

    openViewModal: (station) => {
      setCurrentStation({ ...station });
      setOnView(true);
      setModalOpen(true);
      setError('');
    },

    closeModal: () => {
      setModalOpen(false);
    },

    openDeleteModal: (id) => {
      setStationToDelete(id);
      setDeleteModalOpen(true);
    },

    closeDeleteModal: () => {
      setStationToDelete(null);
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
  const formFields = getStationFormFields({ isAdmin, currentStation });
  const filterOptions = getStationFilterOptions(operators);

  const cellRenderers = getStationCellRenderers({
    getOperatorNameById
  });

  const columns = generateTableColumns({
    columnDefs: stationColumnDefs,
    sortField,
    sortAscending,
    toggleSort: tableHandlers.toggleSort,
    cellRenderers
  });

  // ===== RENDER =====
  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stations</h1>
        <button
          onClick={modalHandlers.openCreateModal}
          className="filled-button"
        >
          <Plus size={16} />
          Add Station
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <EntitySearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCount={activeFilters.length}
        onFilterClick={modalHandlers.openFilterModal}
        entityName="Stations"
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
        data={stations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No stations found"
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
        totalPages={Math.ceil(totalStations / pageSize)}
        pageSize={pageSize}
        totalItems={totalStations}
        itemCount={stations.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={tableHandlers.handlePageSizeChange}
        entityName="Stations"
      />

      {/* Modals */}
      {modalOpen && (
        <EntityFormModal
          entity={currentStation}
          formFields={formFields}
          dropdownOptions={{ operatorId: operators }}
          isAdmin={isAdmin}
          error={error}
          onView={onView}
          onSubmit={crudOperations.handleSubmit}
          onClose={modalHandlers.closeModal}
          entityName="Station"
        />
      )}

      <EntityFilterModal
        isOpen={filterModalOpen}
        onClose={modalHandlers.closeFilterModal}
        filterOptions={filterOptions}
        currentFilters={filters}
        onApplyFilters={filterHandlers.handleFilterSubmit}
        onClearFilters={filterHandlers.clearFilters}
        entityName="Stations"
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={crudOperations.handleDelete}
        onClose={modalHandlers.closeDeleteModal}
        title="Delete Station"
        message="Are you sure you want to delete this station? This action cannot be undone."
      />
    </div>
  );
}

export default Stations;