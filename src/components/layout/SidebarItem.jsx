import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SidebarItem({ icon, text, to, alert, expanded }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <li className="relative">
      <Link
        to={to}
        className={`
          min-h-[44px] relative flex items-center py-2 px-3 my-2 font-medium rounded-md cursor-pointer transition-colors hover:-translate-y-0.5 hover:shadow-lg
          ${isActive ? "bg-turquoise-500 text-white" : "hover:bg-turquoise-100 "}
        `}
        onMouseEnter={() => !expanded && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-32 ml-3" : "w-0 hidden"}`}>
          {text}
        </span>
        {alert && (
          <div className={`absolute right-2 w-2 h-2 rounded ${expanded ? '' : 'top-2'} ${isActive ? 'bg-white' : 'bg-turquoise-500'}`} />
        )}
      </Link>

      {/* Tooltip for collapsed sidebar */}
      {showTooltip && !expanded && (
        <div className="tooltip">
          {text}
        </div>
      )}
    </li>
  );
}

export default SidebarItem;
