'use client';

import { useState } from 'react';
import AccountToggle from './AccountToggle';
import RouteSelect from './RouteSelect';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`transition-all duration-300 ${collapsed ? 'w-12' : 'w-48'}`}>
      <div className='overflow-y-auto sticky top-4 h-[calc(100vh-32px-48px)]'>
        {/* Logo and collapse button at top */}
        <div className={`flex justify-between items-center border-b mb-4 mt-2 pb-2 border-stone-300 min-h-[49px]`}>
            {!collapsed && (
                <img
                src="/zap-logo.svg"
                alt="Logo"
                className="w-38 h-10"
                />
            )}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="cursor-pointer px-2 py-1.5 rounded-md hover:bg-stone-200 text-stone-600"
            >
                {collapsed ? <FiChevronRight size={20}/> : <FiChevronLeft size={20}/>}
            </button>
            </div>
            
            <RouteSelect collapsed={collapsed} />
        </div>
        <AccountToggle collapsed={collapsed} />

    </div>
  );
}

export default Sidebar;