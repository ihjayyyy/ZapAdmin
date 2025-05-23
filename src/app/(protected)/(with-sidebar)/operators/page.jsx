'use client';
import React, { useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { 
  getPagedOperators, 
  createOperator, 
  updateOperator, 
  deleteOperator,  
} from '../../../../services/OperatorServices';
import DynamicTable from "@/components/DynamicTable";
import EntityFormModal from "@/components/EntityFormModal";
import DynamicModal from "@/components/DynamicModal";
import { RiShieldUserLine } from 'react-icons/ri';
import { operatorColumns, operatorFormFields } from './operatorConfig';
import { renderContact, renderActions } from './operatorRenderers';
import { validateOperatorForm } from './operatorValidation';
import { useActionMenu } from "@/components/ActionMenu";

function OperatorsPage() {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Using our custom hook instead of inline state/effects
  const [actionMenuOpen, setActionMenuOpen, menuRefs] = useActionMenu();

  const fetchData = useCallback(async (pagingParams) => {
    try {
      const pagingData = {
        page: pagingParams.page,
        pageSize: pagingParams.pageSize,
        sortField: pagingParams.sortField || 'id',
        sortAscending: pagingParams.sortAscending,
        filter: pagingParams.filter || []
      };
      const response = await getPagedOperators(pagingData, token);
      return {
        data: response.result || [],
        totalItems: response.Pagination?.length || 0
      };
    } catch (err) {
      toast.error(err.message || 'Failed to load operators');
      return {
        data: [],
        totalItems: 0
      };
    }
  }, [token, refreshTrigger]);

  // Handle adding a new operator
  const handleAddOperator = () => {
    setCurrentOperator({
      name: '',
      address: '',
      phone: '',
      email: '',
      contactPerson: ''
    });
    setShowFormModal(true);
  };

  // Handle editing an existing operator
  const handleEditOperator = (operator) => {
      setCurrentOperator(operator);
      setShowFormModal(true);
  };

  // Handle viewing operator details
  const handleViewOperator = (operator) => {
      setCurrentOperator(operator);
      setShowFormModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (operator) => {
    setCurrentOperator(operator);
    setShowDeleteModal(true);
  };

  // Handle actual operator deletion
  const handleDeleteOperator = async () => {
    try {
      setLoading(true);
      await deleteOperator(currentOperator.id, token);
      toast.success('Operator successfully deleted');
      setShowDeleteModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to delete operator');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update existing operator
        await updateOperator(formData.id, formData, token);
        toast.success('Operator updated successfully');
      } else {
        // Create new operator
        await createOperator(formData, token);
        toast.success('Operator created successfully');
      }
      
      setShowFormModal(false);
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to save operator');
    } finally {
      setLoading(false);
    }
  };

  const columns = operatorColumns(
    renderContact,
    (_, item) => renderActions(_, item, handleViewOperator, handleEditOperator, handleDeleteConfirmation, actionMenuOpen, setActionMenuOpen, menuRefs)
  );

  return (
    <>
      <DynamicTable
        title="Operators"
        icon={RiShieldUserLine}
        fetchData={fetchData}
        columns={columns}
        initialPageSize={10}
        onAddClick={handleAddOperator}
      />
      
      {/* Create/Edit Form Modal */}
      {showFormModal && (
        <EntityFormModal
          entity={currentOperator}
          formFields={operatorFormFields}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          validateForm={validateOperatorForm}
          entityName="Operator"
        />
      )}
      
      {/* View Details Modal */}
      {showViewModal && (
        <EntityFormModal
          entity={currentOperator}
          formFields={operatorFormFields}
          onClose={() => setShowViewModal(false)}
          entityName="Operator"
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
          <p className="mb-4">Are you sure you want to delete the operator <strong>{currentOperator?.name}</strong>?</p>
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
              onClick={handleDeleteOperator}
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

export default OperatorsPage;