import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ActivityFilters from './components/ActivityFilters';
import ActivityFeed from './components/ActivityFeed';
import ActivityStats from './components/ActivityStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ActivityLog = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock user data
  const user = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    role: "Healthcare Provider"
  };

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      eventType: 'medication-dispensed',
      status: 'success',
      patientName: 'John Doe',
      medicationName: 'Lisinopril 10mg',
      dosage: '1 tablet',
      description: 'Medication successfully dispensed at scheduled time. Patient confirmed receipt.',
      timestamp: new Date('2025-10-23T08:00:00'),
      deviceId: 'ESP32-001',
      scheduleTime: '8:00 AM',
      stockLevel: 25
    },
    {
      id: 2,
      eventType: 'medication-missed',
      status: 'error',
      patientName: 'Mary Smith',
      medicationName: 'Metformin 500mg',
      dosage: '2 tablets',
      description: 'Patient did not take medication at scheduled time. Caregiver has been notified.',
      timestamp: new Date('2025-10-23T07:30:00'),
      deviceId: 'ESP32-002',
      scheduleTime: '7:30 AM',
      stockLevel: 18
    },
    {
      id: 3,
      eventType: 'low-stock-alert',
      status: 'warning',
      patientName: 'Robert Johnson',
      medicationName: 'Atorvastatin 20mg',
      description: 'Medication stock is running low. Only 8 pills remaining. Please restock soon.',
      timestamp: new Date('2025-10-23T07:15:00'),
      deviceId: 'ESP32-003',
      stockLevel: 8
    },
    {
      id: 4,
      eventType: 'device-status',
      status: 'info',
      description: 'ESP32 device successfully connected to WiFi network. All systems operational.',
      timestamp: new Date('2025-10-23T06:45:00'),
      deviceId: 'ESP32-001'
    },
    {
      id: 5,
      eventType: 'medication-dispensed',
      status: 'success',
      patientName: 'Sarah Wilson',
      medicationName: 'Amlodipine 5mg',
      dosage: '1 tablet',
      description: 'Morning medication dispensed successfully. Patient adherence maintained.',
      timestamp: new Date('2025-10-23T06:30:00'),
      deviceId: 'ESP32-004',
      scheduleTime: '6:30 AM',
      stockLevel: 42
    },
    {
      id: 6,
      eventType: 'schedule-updated',
      status: 'info',
      patientName: 'John Doe',
      medicationName: 'Lisinopril 10mg',
      description: 'Medication schedule updated by healthcare provider. New timing: 8:00 AM daily.',
      timestamp: new Date('2025-10-22T16:20:00'),
      deviceId: 'ESP32-001'
    },
    {
      id: 7,
      eventType: 'medication-dispensed',
      status: 'success',
      patientName: 'Mary Smith',
      medicationName: 'Metformin 500mg',
      dosage: '2 tablets',
      description: 'Evening medication dispensed on schedule. Patient compliance excellent.',
      timestamp: new Date('2025-10-22T19:00:00'),
      deviceId: 'ESP32-002',
      scheduleTime: '7:00 PM',
      stockLevel: 20
    },
    {
      id: 8,
      eventType: 'device-status',
      status: 'error',
      description: 'ESP32 device lost connection to WiFi network. Attempting automatic reconnection.',
      timestamp: new Date('2025-10-22T14:30:00'),
      deviceId: 'ESP32-003'
    },
    {
      id: 9,
      eventType: 'medication-dispensed',
      status: 'success',
      patientName: 'Robert Johnson',
      medicationName: 'Atorvastatin 20mg',
      dosage: '1 tablet',
      description: 'Bedtime medication dispensed successfully. Patient reported no side effects.',
      timestamp: new Date('2025-10-22T22:00:00'),
      deviceId: 'ESP32-003',
      scheduleTime: '10:00 PM',
      stockLevel: 10
    },
    {
      id: 10,
      eventType: 'low-stock-alert',
      status: 'warning',
      patientName: 'Sarah Wilson',
      medicationName: 'Amlodipine 5mg',
      description: 'Medication stock below threshold. 9 pills remaining. Restock recommended within 3 days.',
      timestamp: new Date('2025-10-22T12:00:00'),
      deviceId: 'ESP32-004',
      stockLevel: 9
    }
  ];

  // Mock statistics
  const activityStats = {
    totalEvents: 156,
    medicationsDispensed: 89,
    missedDoses: 7,
    lowStockAlerts: 3
  };

  // Alert counts for sidebar
  const alertCounts = {
    schedules: 2,
    activity: 7
  };

  useEffect(() => {
    // Initialize activities
    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleFilterChange = (filters) => {
    let filtered = [...mockActivities];

    // Apply search filter
    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(activity =>
        activity?.patientName?.toLowerCase()?.includes(query) ||
        activity?.medicationName?.toLowerCase()?.includes(query) ||
        activity?.description?.toLowerCase()?.includes(query) ||
        activity?.eventType?.toLowerCase()?.includes(query)
      );
    }

    // Apply patient filter
    if (filters?.patient) {
      filtered = filtered?.filter(activity =>
        activity?.patientName?.toLowerCase()?.includes(filters?.patient?.replace('-', ' '))
      );
    }

    // Apply event type filter
    if (filters?.eventType) {
      filtered = filtered?.filter(activity => activity?.eventType === filters?.eventType);
    }

    // Apply status filter
    if (filters?.status) {
      filtered = filtered?.filter(activity => activity?.status === filters?.status);
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered?.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        
        switch (filters?.dateRange) {
          case 'today':
            return activityDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday?.setDate(yesterday?.getDate() - 1);
            return activityDate >= yesterday && activityDate < today;
          case 'last-7-days':
            const weekAgo = new Date(today);
            weekAgo?.setDate(weekAgo?.getDate() - 7);
            return activityDate >= weekAgo;
          case 'last-30-days':
            const monthAgo = new Date(today);
            monthAgo?.setDate(monthAgo?.getDate() - 30);
            return activityDate >= monthAgo;
          case 'this-month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return activityDate >= monthStart;
          default:
            return true;
        }
      });
    }

    setFilteredActivities(filtered);
    setCurrentPage(1);
  };

  const handleExportReport = () => {
    // Mock export functionality
    const csvContent = [
      ['Timestamp', 'Event Type', 'Patient', 'Medication', 'Status', 'Description'],
      ...filteredActivities?.map(activity => [
        new Date(activity.timestamp)?.toLocaleString(),
        activity?.eventType,
        activity?.patientName || '',
        activity?.medicationName || '',
        activity?.status,
        activity?.description
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading more data
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoading(false);
      // For demo purposes, we'll just show that there's no more data after page 2
      if (currentPage >= 2) {
        setHasMore(false);
      }
    }, 1000);
  };

  // Get paginated activities
  const itemsPerPage = 10;
  const paginatedActivities = filteredActivities?.slice(0, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={mobileMenuOpen}
        onToggle={handleMobileMenuToggle}
        alertCounts={alertCounts}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-280'}`}>
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          isMobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* Page Content */}
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Activity Log</h1>
                <p className="text-muted-foreground">
                  Monitor medication events, system notifications, and compliance tracking
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate('/medication-schedules')}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  View Schedules
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => navigate('/patient-management')}
                  iconName="Users"
                  iconPosition="left"
                >
                  Manage Patients
                </Button>
              </div>
            </div>

            {/* Activity Statistics */}
            <ActivityStats stats={activityStats} />

            {/* Activity Filters */}
            <ActivityFilters
              onFilterChange={handleFilterChange}
              onExport={handleExportReport}
              totalActivities={filteredActivities?.length}
            />

            {/* Activity Feed */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Recent Activities</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {paginatedActivities?.length} of {filteredActivities?.length} activities
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location?.reload()}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
              </div>

              <ActivityFeed
                activities={paginatedActivities}
                loading={loading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore && paginatedActivities?.length < filteredActivities?.length}
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => navigate('/dashboard')}
                >
                  <Icon name="LayoutDashboard" size={24} className="mb-2" />
                  <span className="font-medium">Dashboard</span>
                  <span className="text-xs text-muted-foreground">System overview</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => navigate('/patient-management')}
                >
                  <Icon name="Users" size={24} className="mb-2" />
                  <span className="font-medium">Patients</span>
                  <span className="text-xs text-muted-foreground">Manage profiles</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => navigate('/medication-schedules')}
                >
                  <Icon name="Calendar" size={24} className="mb-2" />
                  <span className="font-medium">Schedules</span>
                  <span className="text-xs text-muted-foreground">Medication timing</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={handleExportReport}
                >
                  <Icon name="Download" size={24} className="mb-2" />
                  <span className="font-medium">Export</span>
                  <span className="text-xs text-muted-foreground">Generate report</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityLog;