'use client';
import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import {
  getPagedUserOperators,
  createUserOperator,
  updateUserOperator,
  deleteUserOperator,
  getUserOperatorRoles
} from '@/services/UserOperatorServices';
import { getPagedUsers } from '@/services/UserServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { operatorUserColumns, operatorUserFormFields, operatorUserFilterOptions } from "./operatorUserConfig";
import { renderActions, renderRole } from './operatorUserRenderers';
import { validateUserOperatorForm } from "./operatorUserValidation";
import { BsPeople } from "react-icons/bs";
import { useOperatorFilter } from "@/context/OperatorFilterContext";

function OperatorUsersPage() {
  const token = localStorage.getItem('token');
  const { operatorOptions, selectedOperatorId } = useOperatorFilter();
  const [userOptions, setUserOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOperatorUser, setCurrentOperatorUser] = useState(null);
  const [filters, setFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const pagingData = {
          filter: ["userType=2"],
          page: 1,
          pagesize: 1000,
          sortField: "userName",
          sortAscending: true
        };
        const response = await getPagedUsers(pagingData, token);
        const userData = response.result || [];
        setUserOptions(userData.map((user) => ({
          id: user.userId,
          name: `${user.firstName} ${user.lastName}` || `User ${user.userId}`
        })));
      } catch (err) {
        toast.error(err.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getUserOperatorRoles(token);
        setRoleOptions(data.map((role) => ({ id: role.value, name: role.label })));
      } catch (err) {
        toast.error(err.message || 'Failed to load roles');
      }
    };
    fetchRoles();
  }, [token]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setShowFilterModal(false);
  };

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];

    if (additionalFilters.userOperatorRole !== undefined && additionalFilters.userOperatorRole !== '') {
      filterArray.push(`userOperatorRole=${additionalFilters.userOperatorRole}`);
    }

    // Operator scoping now comes solely from the global topbar filter
    if (selectedOperatorId) {
      filterArray.push(`operatorId=${selectedOperatorId}`);
    }

    return filterArray;
  }, [selectedOperatorId]);

  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pagesize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: buildFilterString(pagingParams.filter, filters)
      };

      const response = await getPagedUserOperators(pagingData, token);

      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load operator users');
      return { data: [], totalItems: 0 };
    }
  }, [token, filters, buildFilterString, refreshTrigger, selectedOperatorId]);

  const handleFormSubmit = async (formData) => {
    try {
      if (!validateUserOperatorForm(formData, toast.error)) return;

      if (formData.id) {
        await updateUserOperator(formData.id, formData, token);
        toast.success('Operator User updated successfully');
      } else {
        await createUserOperator(formData, token);
        toast.success('Operator User created successfully');
      }

      setShowFormModal(false);
      setCurrentOperatorUser(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to save operator user');
    }
  };

  const handleDeleteOperatorUser = async () => {
    try {
      await deleteUserOperator(currentOperatorUser.id, token);
      toast.success('Operator User deleted successfully');
      setShowDeleteModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete operator user');
    }
  };

  const handleAdd = () => {
    setCurrentOperatorUser({ userId: '', operatorId: selectedOperatorId || '', userOperatorRole: '' });
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setCurrentOperatorUser(item);
    setShowFormModal(true);
  };

  const handleView = (item) => {
    setCurrentOperatorUser(item);
    setShowViewModal(true);
  };

  const handleDeleteConfirmation = (item) => {
    setCurrentOperatorUser(item);
    setShowDeleteModal(true);
  };

  const columns = operatorUserColumns(
    renderRole,
    (_, item) => renderActions(_, item, handleView, handleEdit, handleDeleteConfirmation)
  );

  const customTableProps = {
    title: "Operator Users",
    icon: BsPeople,
    fetchData,
    columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAdd
  };

  return (
    <>
      <DynamicTable {...customTableProps} />

      {/* Filter Modal - operator filtering removed, handled globally */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={operatorUserFilterOptions(roleOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Operator Users"
      />

      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentOperatorUser}
          formFields={operatorUserFormFields.map((field) => {
            if (field.name === 'operatorId') return { ...field, options: operatorOptions };
            if (field.name === 'userId') return { ...field, options: userOptions };
            if (field.name === 'userOperatorRole') return { ...field, options: roleOptions };
            return field;
          })}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          entityName="Operator User"
        />
      )}

      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentOperatorUser}
          formFields={operatorUserFormFields.map((field) => {
            if (field.name === 'operatorId') return { ...field, options: operatorOptions };
            if (field.name === 'userId') return { ...field, options: userOptions };
            if (field.name === 'userOperatorRole') return { ...field, options: roleOptions };
            return field;
          })}
          onClose={() => setShowViewModal(false)}
          entityName="Operator User"
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
          <p className="mb-4">Are you sure you want to delete this operator user?</p>
          <p className="mb-6 text-sm text-red-600">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteOperatorUser}
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

export default OperatorUsersPage;