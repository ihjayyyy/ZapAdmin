import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AiOutlineLogout } from "react-icons/ai";
import DynamicModal from './DynamicModal';

function TopBar() {
  const { logout, user } = useAuth() // Get logout function and user from auth context
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const now = new Date()
  const hours = now.getHours()
  let greeting = 'Good evening'
  if (hours < 12) {
    greeting = 'Good morning'
  } else if (hours < 18) {
    greeting = 'Good afternoon'
  }

  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }
  const formattedDate = now.toLocaleDateString('en-US', options)

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
    <div className="border-b px-4 mb-4 pb-2 border-stone-200">
      <div className="flex items-center justify-between p-0.5 pt-2.5">
        <div>
          <span className="text-sm font-bold block">🚀 {greeting}, {user?.firstName}!</span>
          <span className="text-xs block text-stone-500">
            {formattedDate}
          </span>
        </div>
        <button
            onClick={handleLogoutClick}
            className="cursor-pointer group relative flex items-center justify-center p-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border border-red-400/30"
            title="Logout"
        >
          <AiOutlineLogout size={18} className="transition-transform duration-300 group-hover:rotate-12" />
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
    
    <DynamicModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        title="Confirm Logout"
        size="sm"
    >
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout? You will need to sign in again to access your account.
        </p>
                
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancelLogout}
            className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="cursor-pointer px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </DynamicModal>
    </>
       
  )
}

export default TopBar