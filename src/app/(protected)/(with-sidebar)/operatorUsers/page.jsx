'use client';
import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getAllUserOperators, 
  createUserOperator, 
  updateUserOperator, 
  deleteUserOperator 
} from '@/services/UserOperatorServices';
import { getAllOperators } from '@/services/OperatorServices';
import { getPagedUsers } from '@/services/UserServices'; // Add this import
import DynamicTable from "@/components/DynamicTable";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { operatorUserColumns, operatorUserFormFields } from "./operatorUserConfig";
import { renderActions, renderOperator, renderUser } from './operatorUserRenderers'; // Add renderUser
import { validateUserOperatorForm } from "./operatorUserValidation";
import { BsPeople } from "react-icons/bs";

function OperatorUsersPage() {
  const token = localStorage.getItem('token');
  const [operators, setOperators] = useState({});
  const [users, setUsers] = useState({}); // Add users state
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]); // Add user options state
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOperatorUser, setCurrentOperatorUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all operators
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getAllOperators(token);
        const operatorMap = data.reduce((acc, operator) => {
          acc[operator.id] = operator;
          return acc;
        }, {});
        setOperators(operatorMap);
        setOperatorOptions(data.map((operator) => ({ id: operator.id, name: operator.name })));
      } catch (err) {
        toast.error(err.message || 'Failed to load operators');
      }
    };

    fetchOperators();
  }, [token]);

  // Fetch users with userType = 2
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const pagingData = {
          filter: ["userType=2"], // Filter for userType = 2
          page: 1,
          pagesize: 1000, // Get a large number to get all users of type 2
          sortField: "userName",
          sortAscending: true
        };
        
        const response = await getPagedUsers(pagingData, token);
        const userData = response.result || []; // Use 'result' based on your API structure
        
        const userMap = userData.reduce((acc, user) => {
          acc[user.userId] = user; // Use 'userId' as the key
          return acc;
        }, {});
        
        setUsers(userMap);
        setUserOptions(userData.map((user) => ({ 
          id: user.userId, // Use 'userId' as the id
          name: user.userName || `${user.firstName} ${user.lastName}` || `User ${user.userId}` 
        })));
      } catch (err) {
        toast.error(err.message || 'Failed to load users');
      }
    };

    fetchUsers();
  }, [token]);

  // Fetch operator users
  const fetchData = useCallback(async () => {
    try {
      const data = await getAllUserOperators(token);
      return { data, totalItems: data.length };
    } catch (err) {
      toast.error(err.message || 'Failed to load operator users');
      return { data: [], totalItems: 0 };
    }
  }, [token, refreshTrigger]);

  // Handle form submission
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

  // Handle delete
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

  // Handle add/edit
  const handleAdd = () => {
    setCurrentOperatorUser({ userId: '', operatorId: '', role: '' });
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setCurrentOperatorUser(item);
    setShowFormModal(true);
  };

  // Handle viewing operator user details
  const handleView = (item) => {
    setCurrentOperatorUser(item);
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (item) => {
    setCurrentOperatorUser(item);
    setShowDeleteModal(true);
  };

  // Table columns - updated to include user rendering
  const columns = operatorUserColumns(
    renderOperator,
    renderUser, // Add renderUser function
    (_, item) => renderActions(_, item, handleView, handleEdit, handleDeleteConfirmation),
    operators,
    users // Pass users to columns
  );

  const customTableProps = {
    title: "Operator Users",
    icon: BsPeople,
    fetchData,
    columns,
    initialPageSize: 10,
    onAddClick: handleAdd
  };

  return (
    <>
      <DynamicTable {...customTableProps} />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentOperatorUser}
          formFields={operatorUserFormFields.map((field) => {
            if (field.name === 'operatorId') {
              return { ...field, options: operatorOptions };
            }
            if (field.name === 'userId') {
              return { ...field, options: userOptions };
            }
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
            if (field.name === 'operatorId') {
              return { ...field, options: operatorOptions };
            }
            if (field.name === 'userId') {
              return { ...field, options: userOptions };
            }
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