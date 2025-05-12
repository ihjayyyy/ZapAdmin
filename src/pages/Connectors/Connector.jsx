import React, { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import DynamicTable from '../../components/DynamicTable';
import { getAllChargingBays } from '../../services/ChargingBayServices';
import { createConnector, updateConnector, getPagedConnectors, deleteConnector, getConnectorTypes } from '../../services/ConnectorServices';
import { getConnectorCellRenderers } from './ConnectorCellRenders';
import EntityFormModal from '../../components/EntityFormModal';
import EntityFilterModal from '../../components/EntityFilterModal';
import EntitySearchBar from '../../components/EntitySearchBar';
import EntityPagination from '../../components/EntityPagination';
import { generateTableColumns } from '../../components/GenerateTableColumns';
import ConfirmationModal from '../../components/ConfirmationModal';
import { connectorColumnDefs, getConnectorFormFields, getConnectorFilterOptions } from './ConnectorConfig';

function Connector() {
  // ===== STATE MANAGEMENT =====
  // Data states
  const [bays, setBays] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [totalConnectors, setTotalConnectors] = useState(0);
  const [connectorTypes, setConnectorTypes] = useState([]);
  const [currentConnector, setCurrentConnector] = useState(null);
  const [connectorToDelete, setConnectorToDelete] = useState(null);
  
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
  const fetchConnectors = useCallback(async () => {
    try {
      setIsLoading(true);
      const pagingData = buildPagingData();
      const data = await getPagedConnectors(pagingData, token);
      setConnectors(data.result);
      setTotalConnectors(data.Pagination.length);
    } catch (err) {
      toast.error(err.message || 'Failed to load connectors');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortAscending, activeFilters, searchTerm, token]);

  const fetchConnectorTypes = async () => {
    try {
      const data = await getConnectorTypes(token);
      console.log(data)
      setConnectorTypes(data);
    } catch (err) {
      console.error("Failed to fetch connector types:", err);
      toast.error("Failed to fetch connector types");
    }
  };

  const fetchBays = async () => {
    try {
      const data = await getAllChargingBays(token);
      setBays(data);
    } catch (err) {
      console.error("Failed to fetch bays:", err);
      toast.error("Failed to fetch charging bays");
    }
  };

  // ===== EFFECTS =====
  // Initial data loading
  useEffect(() => {
    fetchConnectorTypes();
    fetchBays();
  }, []);

  // Load connectors when pagination, sorting or filters change
  useEffect(() => {
    fetchConnectors();
  }, [fetchConnectors]);

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
    
    if (filters.connectorType) {
      pagingData.filter.push(`connectorType=${filters.connectorType}`);
    }

    if (filters.charingBayId) {
      pagingData.filter.push(`chargingBayId=${filters.bayId}`);
    }

    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split('-');
      if (minPrice) pagingData.filter.push(`minPrice=${minPrice}`);
      if (maxPrice) pagingData.filter.push(`maxPrice=${maxPrice}`);
    }
    
    return pagingData;
  };

  // ===== CRUD OPERATIONS =====
  const crudOperations = {
    handleCreate: async (newConnector) => {
      try {
        setIsLoading(true);
        await createConnector(newConnector, token);
        toast.success('Connector created successfully');
        await fetchConnectors();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to create connector');
        setIsLoading(false);
      }
    },

    handleUpdate: async (updatedConnector) => {
      try {
        setIsLoading(true);
        await updateConnector(updatedConnector.id, updatedConnector, token);
        toast.success('Connector updated successfully');
        await fetchConnectors();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to update connector');
        setIsLoading(false);
      }
    },

    handleDelete: async () => {
      if (!connectorToDelete) return;
      
      try {
        setIsLoading(true);
        await deleteConnector(connectorToDelete, token);
        toast.success('Connector deleted successfully');
        await fetchConnectors();
        modalHandlers.closeDeleteModal();
      } catch (err) {
        toast.error(err.message || 'Failed to delete connector');
        setIsLoading(false);
      }
    },

    // Form submission handler
    handleSubmit: (connectorData) => {
      if (connectorData.id) {
        crudOperations.handleUpdate(connectorData);
      } else {
        crudOperations.handleCreate(connectorData);
      }
    }
  };

  // ===== MODAL HANDLERS =====
  const modalHandlers = {
    openCreateModal: () => {
      setCurrentConnector({
        connectorType: '',
        price: 0,
        chargingBayId: 0
      });
      setOnView(false);
      setModalOpen(true);
    },

    openEditModal: (connector) => {
      setCurrentConnector({ ...connector });
      setOnView(false);
      setModalOpen(true);
    },

    openViewModal: (connector) => {
      setCurrentConnector({ ...connector });
      setOnView(true);
      setModalOpen(true);
    },

    closeModal: () => {
      setModalOpen(false);
    },

    openDeleteModal: (id) => {
      setConnectorToDelete(id);
      setDeleteModalOpen(true);
    },

    closeDeleteModal: () => {
      setConnectorToDelete(null);
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
  const cellRenderers = getConnectorCellRenderers();

  const columns = generateTableColumns({
    columnDefs: connectorColumnDefs,
    sortField,
    sortAscending,
    toggleSort: tableHandlers.toggleSort,
    cellRenderers
  });

  // Get the form fields and filter options using the connector type and bays data
  const formFields = getConnectorFormFields(connectorTypes, bays);
  const filterOptions = getConnectorFilterOptions(connectorTypes, bays);

  // ===== RENDER =====
  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connectors</h1>
        <button
          onClick={modalHandlers.openCreateModal}
          className="filled-button"
        >
          <Plus size={16} />
          Add Connector
        </button>
      </div>

      {/* Search and Filter Section */}
      <EntitySearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCount={activeFilters.length}
        onFilterClick={modalHandlers.openFilterModal}
        entityName="Connectors"
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
        data={connectors}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No connectors found"
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
        totalPages={Math.ceil(totalConnectors / pageSize)}
        pageSize={pageSize}
        totalItems={totalConnectors}
        itemCount={connectors.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={tableHandlers.handlePageSizeChange}
        entityName="Connectors"
      />

      {/* Modals */}
      {modalOpen && (
        <EntityFormModal
          entity={currentConnector}
          formFields={formFields}
          onView={onView}
          onSubmit={crudOperations.handleSubmit}
          onClose={modalHandlers.closeModal}
          entityName="Connector"
        />
      )}

      <EntityFilterModal
        isOpen={filterModalOpen}
        onClose={modalHandlers.closeFilterModal}
        filterOptions={filterOptions}
        currentFilters={filters}
        onApplyFilters={filterHandlers.handleFilterSubmit}
        onClearFilters={filterHandlers.clearFilters}
        entityName="Connectors"
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={crudOperations.handleDelete}
        onClose={modalHandlers.closeDeleteModal}
        title="Delete Connector"
        message="Are you sure you want to delete this connector? This action cannot be undone."
      />
    </div>
  );
}

export default Connector;