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

function OperatorAccountRequestPage() {
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');
  const isOperator = user?.userType === 2;
  const operatorId = localStorage.getItem('operatorId');
  
  const [operators, setOperators] = useState({});
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
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // New state for admin responses
  const [approveAdminResponse, setApproveAdminResponse] = useState('');
  const [rejectAdminResponse, setRejectAdminResponse] = useState('');

  // Fetch all operators and users to map IDs to names
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load operators
        const operatorData = await getAllOperators(token);
        const operatorMap = {};
        const operatorOpts = [];
        operatorData.forEach(operator => {
          operatorMap[operator.id] = operator.name;
          operatorOpts.push({ id: operator.id, name: operator.name });
        });
        setOperators(operatorMap);
        setOperatorOptions(operatorOpts);

        // Load users with pagination and filter for userType 1 and 2
        const userPagingData = {
          page: 1,
          pageSize: 1000, // Large page size to get all users
          sortField: 'userId',
          sortAscending: true,
          filter: ['userType=0', 'userType=2'] // Filter for userType 1 and 2
        };
        
        const userData = await getPagedUsers(userPagingData, token);
        const userMap = {};
        const userOpts = [];
        
        // Use the result array from paginated response
        const userList = userData.result || [];
        userList.forEach(user => {
          console.log(user);
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

  // Handle adding a new request
  const handleAddRequest = () => {
    setCurrentRequest({
      operatorId: '',
      email: '',
      firstName: '',
      lastName: ''
    });
    setShowFormModal(true);
  };

  // Handle editing an existing request
  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setShowFormModal(true);
  };

  // Handle viewing request details
  const handleViewRequest = (request) => {
    console.log('Viewing request:', request);
    setCurrentRequest(request);
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (request) => {
    setCurrentRequest(request);
    setShowDeleteModal(true);
  };

  // Handle approve confirmation
  const handleApproveConfirmation = (request) => {
    setCurrentRequest(request);
    setApproveAdminResponse(''); // Reset admin response
    setShowApproveModal(true);
  };

  // Handle reject confirmation
  const handleRejectConfirmation = (request) => {
    setCurrentRequest(request);
    setRejectAdminResponse(''); // Reset admin response
    setShowRejectModal(true);
  };

  // Handle request approval
  const handleApproveRequest = async () => {
    try {
      setLoading(true);
      await approveStatus(currentRequest.id, approveAdminResponse, token);
      toast.success('Request approved successfully');
      setShowApproveModal(false);
      setApproveAdminResponse(''); // Clear the response
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  // Handle request rejection
  const handleRejectRequest = async () => {
    try {
      setLoading(true);
      await rejectStatus(currentRequest.id, rejectAdminResponse, token);
      toast.success('Request rejected successfully');
      setShowRejectModal(false);
      setRejectAdminResponse(''); // Clear the response
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  // Handle actual request deletion
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

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Create the API payload matching the required structure
      const requestData = {
        operatorId: parseInt(formData.operatorId), // Ensure it's a number
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      
      if (formData.id) {
        // Update existing request
        await update(formData.id, requestData, token);
        toast.success('Request updated successfully');
      } else {
        // Create new request
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
    
    if (additionalFilters?.operatorId) {
      filterArray.push(`operatorId=${additionalFilters.operatorId}`);
    }
    
    if (additionalFilters?.status !== undefined) {
      filterArray.push(`status=${additionalFilters.status}`);
    }

    if (additionalFilters?.requestedByUserId) {
      filterArray.push(`requestedByUserId=${additionalFilters.requestedByUserId}`);
    }

    // Auto-filter by operator if user is an operator (same pattern as ChargingBaysPage)
    if (isOperator && operatorId) {
      if (!filterArray.some(f => f.startsWith("operatorId="))) {
        filterArray.push(`operatorId=${operatorId}`);
      }
    }
    
    // Always return an array, even if empty
    return filterArray;
  }, [isOperator, operatorId]);
  

  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: buildFilterString(pagingParams.filter, filters)
      };
      console.log('Fetching data with pagingData:', pagingData);
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
    (operatorId) => renderOperator(operatorId, operators),
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
    // Only show Add button if user is an operator
    ...(isOperator && { onAddClick: handleAddRequest })
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Filter Modal */}
      <EntityFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={requestFilterOptions(operatorOptions, userOptions)}
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
            // Remove requestedByUserId since it's not needed for create/edit
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
      
      {/* Delete Confirmation Modal */}
      <DynamicModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-2">
          <p className="mb-4">
            Are you sure you want to delete the request from <strong>{currentRequest?.firstName} {currentRequest?.lastName}</strong>?
          </p>
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
              onClick={handleDeleteRequest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </DynamicModal>

      {/* Approve Confirmation Modal with Admin Response Input */}
      <DynamicModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Request"
        size="lg"
      >
        <div className="p-2">
          <p className="mb-4">
            You are about to approve the request from <strong>{currentRequest?.firstName} {currentRequest?.lastName}</strong>.
          </p>
          <p className="mb-6 text-sm text-green-600">This will grant operator access to the user.</p>
          
          {/* Admin Response Input */}
          <div className="mb-6">
            <label htmlFor="approveAdminResponse" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Response <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="approveAdminResponse"
              value={approveAdminResponse}
              onChange={(e) => setApproveAdminResponse(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical"
              placeholder="Enter your response or comments for the user (optional)..."
            />
            <p className="mt-1 text-xs text-gray-500">
              This message will be sent to the user along with the approval notification.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowApproveModal(false);
                setApproveAdminResponse('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleApproveRequest}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Approving...' : 'Approve Request'}
            </button>
          </div>
        </div>
      </DynamicModal>

      {/* Reject Confirmation Modal with Admin Response Input */}
      <DynamicModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Request"
        size="lg"
      >
        <div className="p-2">
          <p className="mb-4">
            You are about to reject the request from <strong>{currentRequest?.firstName} {currentRequest?.lastName}</strong>.
          </p>
          <p className="mb-6 text-sm text-orange-600">The user will be notified of the rejection.</p>
          
          {/* Admin Response Input */}
          <div className="mb-6">
            <label htmlFor="rejectAdminResponse" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Response <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectAdminResponse"
              value={rejectAdminResponse}
              onChange={(e) => setRejectAdminResponse(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-vertical"
              placeholder="Please provide a reason for rejecting this request..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Please explain why the request is being rejected. This message will be sent to the user.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowRejectModal(false);
                setRejectAdminResponse('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleRejectRequest}
              disabled={loading || !rejectAdminResponse.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Rejecting...' : 'Reject Request'}
            </button>
          </div>
        </div>
      </DynamicModal>
    </>
  );
}

export default OperatorAccountRequestPage;