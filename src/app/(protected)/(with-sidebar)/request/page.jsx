'use client';
import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getPaged, 
  create, 
  update, 
  remove,
  updateStatus, 
  rejectStatus,
  approveStatus
} from '../../../../services/OperatorRequestAccountServices';

import { getAllOperators } from '../../../../services/OperatorServices';
import { getPagedUsers } from '../../../../services/UserServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFilterModal from "@/components/EntityFilterModal";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { requestColumns, requestFormFields, requestFilterOptions } from './requestConfig';
import { renderOperator, renderUser, renderStatus, renderRequestDate, renderActions } from './requestRenderers';
import { validateRequestForm } from './requestValidation';
import { FiUsers } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useOperatorFilter } from "@/context/OperatorFilterContext";

function OperatorAccountRequestPage() {
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const isOperator = user?.userType === 2;
  const { operatorOptions, selectedOperatorId } = useOperatorFilter();
  
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [filters, setFilters] = useState({});
  const [userOptions, setUserOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [approveAdminResponse, setApproveAdminResponse] = useState('');
  const [rejectAdminResponse, setRejectAdminResponse] = useState('');

  // Fetch users to map IDs to names (operators now come from global context)
  useEffect(() => {
    const loadData = async () => {
      try {
        const userPagingData = {
          page: 1,
          pageSize: 1000,
          sortField: 'userId',
          sortAscending: true,
          filter: ['userType=0', 'userType=2']
        };
        
        const userData = await getPagedUsers(userPagingData, token);
        const userMap = {};
        const userOpts = [];
        
        const userList = userData.result || [];
        userList.forEach(user => {
          userMap[user.userId] = `${user.firstName} ${user.lastName}`;
          userOpts.push({ userId: user.userId, name: `${user.firstName} ${user.lastName}` });
        });
        setUsers(userMap);
        setUserOptions(userOpts);
      } catch (error) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleAddRequest = () => {
    setCurrentRequest({
      operatorId: selectedOperatorId || '',
      email: '',
      firstName: '',
      lastName: ''
    });
    setShowFormModal(true);
  };

  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setShowFormModal(true);
  };

  const handleViewRequest = (request) => {
    setCurrentRequest(request);
    setShowViewModal(true);
  };

  const handleDeleteConfirmation = (request) => {
    setCurrentRequest(request);
    setShowDeleteModal(true);
  };

  const handleApproveConfirmation = (request) => {
    setCurrentRequest(request);
    setApproveAdminResponse('');
    setShowApproveModal(true);
  };

  const handleRejectConfirmation = (request) => {
    setCurrentRequest(request);
    setRejectAdminResponse('');
    setShowRejectModal(true);
  };

  const handleApproveRequest = async () => {
    try {
      setLoading(true);
      await approveStatus(currentRequest.id, approveAdminResponse, token);
      toast.success('Request approved successfully');
      setShowApproveModal(false);
      setApproveAdminResponse('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    try {
      setLoading(true);
      await rejectStatus(currentRequest.id, rejectAdminResponse, token);
      toast.success('Request rejected successfully');
      setShowRejectModal(false);
      setRejectAdminResponse('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      setLoading(true);
      await remove(currentRequest.id, token);
      toast.success('Request successfully deleted');
      setShowDeleteModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete request');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const requestData = {
        operatorId: parseInt(formData.operatorId),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      
      if (formData.id) {
        await update(formData.id, requestData, token);
        toast.success('Request updated successfully');
      } else {
        await create(requestData, token);
        toast.success('Request created successfully');
      }
      
      setShowFormModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to save request');
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
    setShowFilterModal(false);
  };

  const buildFilterString = useCallback((baseFilters, additionalFilters) => {
    const filterArray = [...(baseFilters || [])];
    
    if (additionalFilters?.status !== undefined) {
      filterArray.push(`status=${additionalFilters.status}`);
    }

    if (additionalFilters?.requestedByUserId) {
      filterArray.push(`requestedByUserId=${additionalFilters.requestedByUserId}`);
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
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: buildFilterString(pagingParams.filter, filters)
      };
      const response = await getPaged(pagingData, token);
      
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load requests');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, filters, buildFilterString, refreshTrigger]);

  const columns = requestColumns(
    (operatorId) => renderOperator(operatorId, Object.fromEntries(operatorOptions.map(o => [o.id, o.name]))),
    (userId) => renderUser(userId, users),
    renderStatus,
    renderRequestDate,
    (_, item) => renderActions(
      _, 
      item, 
      handleViewRequest, 
      handleEditRequest, 
      handleDeleteConfirmation,
      handleApproveConfirmation,
      handleRejectConfirmation,
      user
    )
  );

  const customTableProps = {
    title: "Operator Account Requests",
    icon: FiUsers,
    fetchData: fetchData,
    columns: columns,
    initialPageSize: 10,
    onFilterClick: () => setShowFilterModal(true),
    hasActiveFilters: Object.keys(filters).length > 0,
    ...(isOperator && { onAddClick: handleAddRequest })
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal - operator filtering removed, handled globally */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={requestFilterOptions(userOptions)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        entityName="Requests"
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentRequest}
          formFields={requestFormFields}
          dropdownOptions={{ 
            operatorId: operatorOptions
          }}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateRequestForm}
          entityName="Request"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentRequest}
          formFields={requestFormFields}
          dropdownOptions={{ 
            operatorId: operatorOptions,
            requestedByUserId: userOptions
          }}
          onClose={() => setShowViewModal(false)}
          entityName="Request"
          onView={true}
        />
      )}
      
      {/* Delete, Approve, Reject modals unchanged - omitted here for brevity, keep as-is */}
    </>
  );
}

export default OperatorAccountRequestPage;