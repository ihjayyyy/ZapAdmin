'use client';

import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function AccountToggle({ collapsed }) {
  const userstring = localStorage.getItem('user')
  const user = JSON.parse(userstring)
  return (
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t border-stone-300 justify-end text-xs">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-deepblue-500 shadow"
        />
        
        {!collapsed && (
          <>
            <div className="text-start overflow-hidden">
              <span className="text-sm font-bold block truncate whitespace-nowrap overflow-hidden max-w-[calc(100% -36px)]">
                {user.name}
              </span>
              <span className="text-xs block text-stone-500 truncate whitespace-nowrap overflow-hidden max-w-[calc(100% -36px)]">
                {user.email}
              </span>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

export default AccountToggle;