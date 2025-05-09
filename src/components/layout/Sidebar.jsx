import { useState, useEffect } from 'react';
import { AlignJustify, HelpCircle, LayoutDashboard, MoreVertical, Settings, X, LogOut, Fuel, ShieldUser, PlugZap, Zap } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ expanded: externalExpanded, setExpanded: setExternalExpanded }) {
  // Define the SM breakpoint (640px is standard for Tailwind's sm)
  const SM_BREAKPOINT = 900;
  
  // Internal state to manage expanded status if not controlled externally
  const [internalExpanded, setInternalExpanded] = useState(true);
  
  // Use either external or internal state based on what's provided
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const setExpanded = setExternalExpanded || setInternalExpanded;

  const { logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Track if we've done the initial sizing
  const [initialSizingDone, setInitialSizingDone] = useState(false);
  
  // Check screen width only on component mount for initial state
  useEffect(() => {
    // Only set the initial state once on first render
    if (!initialSizingDone) {
      const isSmallScreen = window.innerWidth < SM_BREAKPOINT;
      if (isSmallScreen) {
        setExpanded(false);
      }
      setInitialSizingDone(true);
    }
  }, [setExpanded, initialSizingDone]);
  
  // Handle window resize separately
  useEffect(() => {
    const handleResize = () => {
      // This only updates the state when transitioning from large to small screens
      // and only if we're currently expanded
      if (window.innerWidth < SM_BREAKPOINT && expanded) {
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expanded, setExpanded]);

  let user = null;
  const userString = localStorage.getItem('user');
  if (userString) {
    user = JSON.parse(userString);
  }

  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    window.location.href = '/login';
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <aside className={`h-screen fixed transition-all duration-300 z-10 ${expanded ? "w-60" : "w-17"}`}>
      <nav className="h-full flex flex-col bg-white shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center min-h-[60.8px]">
          <img
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0 hidden"}`}
            src="/zap-logo.svg"
            alt="Logo"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <X size={20} /> : <AlignJustify size={20} />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/" expanded={expanded} />
          <SidebarItem icon={<ShieldUser size={20} />} text="Operators" to="/operators" expanded={expanded} />
          <SidebarItem icon={<Zap size={20} />} text="Stations" to="/stations" expanded={expanded} />
          <SidebarItem icon={<Fuel size={20} />} text="Charging Bay" to="/bays" expanded={expanded} />
          <SidebarItem icon={<Settings size={20} />} text="Settings" to="/settings" expanded={expanded} />
          <SidebarItem icon={<HelpCircle size={20} />} text="Help" to="/help" expanded={expanded} />

          <li className="relative hover:bg-turquoise-100 rounded-md hover:-translate-y-0.5 hover:shadow-lg">
            <button
              onClick={handleLogoutClick}
              className="w-full min-h-[44px] relative text-left flex items-center py-2 px-3 my-2 font-medium rounded-md cursor-pointer transition-colors"
              onMouseEnter={() => !expanded && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <LogOut size={20} />
              <span className={`overflow-hidden transition-all ${expanded ? "w-32 ml-3" : "w-0 hidden"}`}>
                Logout
              </span>
            </button>

            {showTooltip && !expanded && (
              <div className="tooltip">
                Logout
              </div>
            )}
          </li>
        </ul>

        <div className="flex p-3">
          <div className="py-2 px-2.5 rounded-full bg-deep-blue-500 text-white font-bold flex items-center justify-center">
            {user?.name ? getUserInitials(user.name) : ''}
          </div>
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0 ml-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">{user?.name}</h4>
              <p className="text-xs text-turquoise-500">{user?.email}</p>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="filled-button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;