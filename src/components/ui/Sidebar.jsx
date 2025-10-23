import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle, alertCounts = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'System overview and quick actions'
    },
    {
      label: 'Patients',
      path: '/patient-management',
      icon: 'Users',
      tooltip: 'Patient profile management'
    },
    {
      label: 'Schedules',
      path: '/medication-schedules',
      icon: 'Calendar',
      tooltip: 'Medication schedule management',
      alertCount: alertCounts?.schedules || 0
    },
    {
      label: 'Activity',
      path: '/activity-log',
      icon: 'Activity',
      tooltip: 'Event logging and compliance monitoring',
      alertCount: alertCounts?.activity || 0
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-card border-r border-border z-1000 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-16' : 'w-280'
      } hidden lg:block`}>
        
        {/* Logo Section */}
        <div className="flex items-center h-16 px-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Pill" size={20} color="var(--color-primary-foreground)" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-foreground">Smart Pill</h1>
                <p className="text-xs text-muted-foreground">Dispenser</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems?.map((item) => (
              <li key={item?.path}>
                <Button
                  variant={isActive(item?.path) ? "default" : "ghost"}
                  className={`w-full justify-start relative ${
                    isCollapsed ? 'px-3' : 'px-4'
                  } h-12 transition-all duration-200 ease-out hover:scale-95`}
                  onClick={() => handleNavigation(item?.path)}
                  title={isCollapsed ? item?.tooltip : undefined}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={`${isCollapsed ? '' : 'mr-3'} flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item?.label}</span>
                  )}
                  
                  {/* Alert Badge */}
                  {item?.alertCount > 0 && (
                    <span className={`absolute ${
                      isCollapsed ? 'top-1 right-1' : 'top-2 right-2'
                    } bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-pulse-status z-1200`}>
                      {item?.alertCount > 99 ? '99+' : item?.alertCount}
                    </span>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10"
            onClick={onToggle}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
            />
          </Button>
        </div>
      </aside>
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-1100 transition-opacity duration-300 ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-soft"
          onClick={onToggle}
        />
        
        {/* Mobile Menu */}
        <aside className={`absolute left-0 top-0 h-full w-280 bg-card border-r border-border transform transition-transform duration-300 ease-out ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}>
          
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Pill" size={20} color="var(--color-primary-foreground)" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Smart Pill</h1>
                <p className="text-xs text-muted-foreground">Dispenser</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems?.map((item) => (
                <li key={item?.path}>
                  <Button
                    variant={isActive(item?.path) ? "default" : "ghost"}
                    className="w-full justify-start px-4 h-12 relative transition-all duration-200 ease-out"
                    onClick={() => {
                      handleNavigation(item?.path);
                      onToggle(); // Close mobile menu after navigation
                    }}
                  >
                    <Icon name={item?.icon} size={20} className="mr-3 flex-shrink-0" />
                    <span className="font-medium">{item?.label}</span>
                    
                    {/* Alert Badge */}
                    {item?.alertCount > 0 && (
                      <span className="absolute top-2 right-2 bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-pulse-status z-1200">
                        {item?.alertCount > 99 ? '99+' : item?.alertCount}
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;