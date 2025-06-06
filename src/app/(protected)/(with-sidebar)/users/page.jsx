'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from 'react-toastify';
import {getPagedUsers, createUser} from '../../../../services/UserServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import { usersColumns, usersFilterOptions, usersFormFields } from "./usersConfig";
import { renderActions, renderConfirmed, renderUsertype } from './userRenderers';
import { validateUserForm } from './userValidation';
import { BsPerson } from "react-icons/bs";
function UsersPage() {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

const handleAddUser = () => {
  setCurrentUser({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    userType: 'user',
    confirmed: false,
  });
  setShowFormModal(true);
}

  const handleViewUser = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  }

const handleFormSubmit = async (formData) => {
  try {
    // Ensure password is always 123456
    const userData = {
      ...formData,
      password: '123456'
    };
    
    await createUser(userData, token);
    toast.success('User created successfully');
    setShowFormModal(false);
    setCurrentUser(null);
    setRefreshTrigger(prev => prev + 1);
  } catch (error) {
    toast.error(error.message || 'Failed to save user');
  } finally {
    setLoading(false);
  }
}

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }

  const handleClearFilters = () => {
    setFilters({});
    setShowFilterModal(false);
  }

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters.userType) {
      filterArray.push(`userType=${additionalFilters.userType}`);
    }
    
    if (additionalFilters.confirmed !== undefined) {
      filterArray.push(`confirmed=${additionalFilters.confirmed}`);
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
      
      const response = await getPagedUsers(pagingData, token);
      
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
  }, [token, filters, buildFilterString, refreshTrigger]);

  const columns = usersColumns(
    (user, item) => renderActions(user, item, handleViewUser),
    renderConfirmed,
    renderUsertype,
  );

  const customTableProps = {
    title: "Users",
    icon: BsPerson,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    onAddClick: handleAddUser
  };
    

  return (
    <>
      <DynamicTable {...customTableProps} />
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={usersFilterOptions()}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Users"
      />

      {showFormModal && (
        <EntityFormModal
          entity={currentUser}
          formFields={usersFormFields}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateUserForm}
          entityName="Users"
        />
      )}

      {showViewModal && (
        <EntityFormModal
          entity={currentUser}
          formFields={usersFormFields}
          onClose={() => setShowViewModal(false)}
          entityName="Users"
          onView={true}
        />
      )}
      
    </>
  )
}

export default UsersPage