import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, onLogout, isMobileMenuOpen, onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    const pathTitles = {
      '/dashboard': 'Dashboard',
      '/patient-management': 'Patient Management',
      '/medication-schedules': 'Medication Schedules',
      '/activity-log': 'Activity Log',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/login': 'Login',
      '/register': 'Register'
    };
    return pathTitles?.[location?.pathname] || 'Smart Pill Dispenser';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-3"
            onClick={onMobileMenuToggle}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.name ? user?.name?.charAt(0)?.toUpperCase() : 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role || 'Caregiver'}
              </p>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </Button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-1100">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <button
                  className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                >
                  <Icon name="User" size={16} />
                  <span>Profile</span>
                </button>
                
                <button
                  className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                >
                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </button>
                
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout?.();
                    }}
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-1000" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;