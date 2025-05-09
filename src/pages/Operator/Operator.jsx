import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
// You can also import from utility file
// import { toastSuccess, toastError, toastCRUD } from '../../utils/toastUtil';

// Components
import DynamicTable from '../../components/DynamicTable';
import EntityFormModal from '../../components/EntityFormModal';
import EntitySearchBar from '../../components/EntitySearchBar';
import EntityPagination from '../../components/EntityPagination';
import ConfirmationModal from '../../components/ConfirmationModal';

// Services and utilities
import {
  createOperator,
  updateOperator,
  deleteOperator,
  getAllOperators,
  getPagedOperators
} from '../../services/OperatorServices';
import { generateTableColumns } from '../../components/GenerateTableColumns';
import { getOperatorFormFields, operatorColumnDefs } from './OperatorConfig';

function Operators() {
  // ===== STATE MANAGEMENT =====
  // Core data state
  const [operators, setOperators] = useState([]);
  const [totalOperators, setTotalOperators] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortAscending, setSortAscending] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [onView, setOnView] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState(null);

  // Auth state 
  const token = localStorage.getItem('token');
  const userOperatorId = localStorage.getItem('operatorId');
  const isAdmin = !userOperatorId;

  // ===== DATA FETCHING =====
  // Fetch operators - memoized to prevent unnecessary re-renders
  const fetchOperators = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!isAdmin) {
        // For non-admin users, they should only see their own operator
        const data = await getAllOperators(token);
        const filteredData = data.filter(op => op.id === userOperatorId);
        setOperators(filteredData);
        setTotalOperators(filteredData.length);
      } else {
        // For admin users, get paged operators with filters
        const pagingData = {
          page: currentPage,
          pageSize,
          sortField,
          sortAscending,
          filter: searchTerm ? [`searchTerm=${searchTerm}`] : []
        };

        const data = await getPagedOperators(pagingData, token);
        setOperators(data.result);
        setTotalOperators(data.Pagination.length);
      }

      // Optional toast for data loaded
      // toast.info('Operators loaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to load operators');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortAscending, searchTerm, isAdmin, token, userOperatorId]);

  // ===== EFFECT HOOKS =====
  // Data fetching effect
  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

  // Search debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, fetchOperators]);

  // ===== CRUD OPERATIONS =====
  const crudOperations = {
    handleCreate: async (newOperator) => {
      try {
        setIsLoading(true);
        await createOperator(newOperator, token);
        toast.success('Operator created successfully');
        await fetchOperators();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to create operator');
        setIsLoading(false);
      }
    },

    handleUpdate: async (updatedOperator) => {
      try {
        setIsLoading(true);
        await updateOperator(updatedOperator.id, updatedOperator, token);
        toast.success('Operator updated successfully');
        await fetchOperators();
        modalHandlers.closeModal();
      } catch (err) {
        toast.error(err.message || 'Failed to update operator');
        setIsLoading(false);
      }
    },

    handleDelete: async () => {
      if (!operatorToDelete) return;
      
      try {
        setIsLoading(true);
        await deleteOperator(operatorToDelete, token);
        toast.success('Operator deleted successfully');
        await fetchOperators();
        modalHandlers.closeDeleteModal();
      } catch (err) {
        toast.error(err.message || 'Failed to delete operator');
        setIsLoading(false);
      }
    },

    // Form submission handler
    handleSubmit: (operatorData) => {
      if (operatorData.id) {
        crudOperations.handleUpdate(operatorData);
      } else {
        crudOperations.handleCreate(operatorData);
      }
    }
  };

  // ===== MODAL HANDLERS =====
  const modalHandlers = {
    openCreateModal: () => {
      setCurrentOperator({
        name: '',
        address: '',
        contact: '',
        email: '',
        phone: '',
        active: true
      });
      setOnView(false);
      setModalOpen(true);
    },

    openEditModal: (operator) => {
      setCurrentOperator({ ...operator });
      setOnView(false);
      setModalOpen(true);
    },

    openViewModal: (operator) => {
      setCurrentOperator({ ...operator });
      setOnView(true);
      setModalOpen(true);
    },

    closeModal: () => {
      setModalOpen(false);
    },

    openDeleteModal: (id) => {
      setOperatorToDelete(id);
      setDeleteModalOpen(true);
    },

    closeDeleteModal: () => {
      setOperatorToDelete(null);
      setDeleteModalOpen(false);
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

  // ===== TABLE CONFIGURATION =====
  // Generate table columns
  const columns = generateTableColumns({
    columnDefs: operatorColumnDefs,
    sortField,
    sortAscending,
    toggleSort: tableHandlers.toggleSort,
  });

  // Get form fields
  const formFields = getOperatorFormFields();

  // ===== RENDER UI =====
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Operators</h1>
        {isAdmin && (
          <button
            onClick={modalHandlers.openCreateModal}
            className="filled-button"
          >
            <Plus size={16} />
            Add Operator
          </button>
        )}
      </div>

      {/* Search bar - admin only */}
      {isAdmin && (
        <EntitySearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          entityName="Operators"
          showFilter={false}
        />
      )}

      {/* Operators table */}
      <DynamicTable
        data={operators}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No operators found"
        onEdit={isAdmin ? modalHandlers.openEditModal : null}
        onDelete={isAdmin ? modalHandlers.openDeleteModal : null}
        onView={modalHandlers.openViewModal}
        sortField={sortField}
        sortAscending={sortAscending}
        onSort={tableHandlers.toggleSort}
      />

      {/* Pagination*/}
      <EntityPagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalOperators / pageSize)}
        pageSize={pageSize}
        totalItems={totalOperators}
        itemCount={operators.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={tableHandlers.handlePageSizeChange}
        entityName="Operators"
      />

      {/* Entity form modal */}
      {modalOpen && (
        <EntityFormModal
          entity={currentOperator}
          formFields={formFields}
          onView={onView}
          onSubmit={crudOperations.handleSubmit}
          onClose={modalHandlers.closeModal}
          entityName="Operator"
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={crudOperations.handleDelete}
        onClose={modalHandlers.closeDeleteModal}
        title="Delete Operator"
        message="Are you sure you want to delete this operator? This action cannot be undone. All stations associated with this operator will also be deleted."
      />
    </div>
  );
}

export default Operators;