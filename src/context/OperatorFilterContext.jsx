'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOperatorDropdownOptions } from '@/services/OperatorServices';

const OperatorFilterContext = createContext(null);

// Empty string represents "All Operators" (only meaningful/available for super admins)
export const ALL_OPERATORS_VALUE = '';

export function OperatorFilterProvider({ children }) {
  const { user } = useAuth();
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [loadingOperators, setLoadingOperators] = useState(true);
  const [selectedOperatorId, setSelectedOperatorIdState] = useState(() => {
    if (typeof window === 'undefined') return ALL_OPERATORS_VALUE;
    return localStorage.getItem('selectedOperatorId') || ALL_OPERATORS_VALUE;
  });

  // UserType.Admin = 0 in the backend enum
  const isSuperAdmin = user?.userType === 0;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoadingOperators(false);
      return;
    }

    const loadOperatorOptions = async () => {
      try {
        const options = await getOperatorDropdownOptions(token);
        const mapped = (options || []).map(op => ({ id: op.id, name: op.name }));
        setOperatorOptions(mapped);

        // Make sure the current selection is still valid for this user;
        // non-admins default to their first accessible operator, admins default to "All".
        setSelectedOperatorIdState(prev => {
          const stillValid = prev !== ALL_OPERATORS_VALUE
            && mapped.some(op => String(op.id) === String(prev));

          if (stillValid) return prev;

          if (!isSuperAdmin && mapped.length > 0) {
            return String(mapped[0].id);
          }

          return ALL_OPERATORS_VALUE;
        });
      } catch (error) {
        console.error('Failed to load operator dropdown options:', error);
      } finally {
        setLoadingOperators(false);
      }
    };

    loadOperatorOptions();
  }, [isSuperAdmin]);

  const setSelectedOperatorId = useCallback((value) => {
    setSelectedOperatorIdState(value);
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem('selectedOperatorId', value);
      } else {
        localStorage.removeItem('selectedOperatorId');
      }
    }
  }, []);

  const contextValue = {
    operatorOptions,
    selectedOperatorId,
    setSelectedOperatorId,
    isSuperAdmin,
    loadingOperators,
  };

  return (
    <OperatorFilterContext.Provider value={contextValue}>
      {children}
    </OperatorFilterContext.Provider>
  );
}

export function useOperatorFilter() {
  const ctx = useContext(OperatorFilterContext);
  if (!ctx) {
    throw new Error('useOperatorFilter must be used within an OperatorFilterProvider');
  }
  return ctx;
}