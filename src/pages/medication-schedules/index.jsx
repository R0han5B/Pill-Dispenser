import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ScheduleCard from './components/ScheduleCard';
import ScheduleForm from './components/ScheduleForm';
import FilterControls from './components/FilterControls';
import StatsOverview from './components/StatsOverview';
import NotificationPermission from './components/NotificationPermission';

const MedicationSchedules = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    patient: '',
    status: '',
    stock: ''
  });

  // Mock user data
  const user = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    role: "Primary Caregiver"
  };

  // Mock patients data
  const patients = [
    {
      id: "1",
      name: "Robert Chen",
      age: 72,
      conditions: ["Hypertension", "Diabetes"]
    },
    {
      id: "2", 
      name: "Maria Rodriguez",
      age: 68,
      conditions: ["Arthritis", "Heart Disease"]
    },
    {
      id: "3",
      name: "James Wilson",
      age: 75,
      conditions: ["COPD", "High Cholesterol"]
    },
    {
      id: "4",
      name: "Linda Thompson",
      age: 70,
      conditions: ["Osteoporosis", "Hypertension"]
    }
  ];

  // Mock schedules data
  const mockSchedules = [
    {
      id: "1",
      patientId: "1",
      patientName: "Robert Chen",
      medicationName: "Metformin",
      dosage: "500mg",
      frequency: "twice-daily",
      timing: "08:00",
      nextDose: "08:00 AM",
      instructions: "Take with breakfast",
      currentStock: 15,
      status: "pending",
      deviceStatus: "online",
      createdAt: "10/20/2025",
      lastTaken: "10/22/2025 08:00 AM"
    },
    {
      id: "2",
      patientId: "1",
      patientName: "Robert Chen", 
      medicationName: "Lisinopril",
      dosage: "10mg",
      frequency: "daily",
      timing: "20:00",
      nextDose: "08:00 PM",
      instructions: "Take before bedtime",
      currentStock: 8,
      status: "taken",
      deviceStatus: "online",
      createdAt: "10/18/2025",
      lastTaken: "10/22/2025 08:00 PM"
    },
    {
      id: "3",
      patientId: "2",
      patientName: "Maria Rodriguez",
      medicationName: "Ibuprofen",
      dosage: "200mg",
      frequency: "as-needed",
      timing: "12:00",
      nextDose: "As needed",
      instructions: "Take with food for pain",
      currentStock: 25,
      status: "pending",
      deviceStatus: "offline",
      createdAt: "10/19/2025",
      lastTaken: "10/21/2025 12:30 PM"
    },
    {
      id: "4",
      patientId: "2",
      patientName: "Maria Rodriguez",
      medicationName: "Atorvastatin",
      dosage: "20mg",
      frequency: "daily",
      timing: "21:00",
      nextDose: "09:00 PM",
      instructions: "Take with dinner",
      currentStock: 3,
      status: "missed",
      deviceStatus: "online",
      createdAt: "10/15/2025",
      lastTaken: "10/20/2025 09:00 PM"
    },
    {
      id: "5",
      patientId: "3",
      patientName: "James Wilson",
      medicationName: "Albuterol Inhaler",
      dosage: "2 puffs",
      frequency: "as-needed",
      timing: "06:00",
      nextDose: "As needed",
      instructions: "Use for breathing difficulty",
      currentStock: 12,
      status: "pending",
      deviceStatus: "online",
      createdAt: "10/16/2025",
      lastTaken: "10/22/2025 02:15 PM"
    },
    {
      id: "6",
      patientId: "4",
      patientName: "Linda Thompson",
      medicationName: "Calcium Carbonate",
      dosage: "500mg",
      frequency: "twice-daily",
      timing: "09:00",
      nextDose: "09:00 AM",
      instructions: "Take with meals",
      currentStock: 30,
      status: "taken",
      deviceStatus: "online",
      createdAt: "10/17/2025",
      lastTaken: "10/23/2025 09:00 AM"
    }
  ];

  useEffect(() => {
    setSchedules(mockSchedules);
    setFilteredSchedules(mockSchedules);
  }, []);

  // Filter schedules based on current filters
  useEffect(() => {
    let filtered = [...schedules];

    if (filters?.search) {
      filtered = filtered?.filter(schedule =>
        schedule?.medicationName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        schedule?.patientName?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.patient) {
      filtered = filtered?.filter(schedule => schedule?.patientId === filters?.patient);
    }

    if (filters?.status) {
      filtered = filtered?.filter(schedule => schedule?.status === filters?.status);
    }

    if (filters?.stock) {
      switch (filters?.stock) {
        case 'low':
          filtered = filtered?.filter(schedule => schedule?.currentStock <= 10);
          break;
        case 'critical':
          filtered = filtered?.filter(schedule => schedule?.currentStock <= 5);
          break;
        case 'normal':
          filtered = filtered?.filter(schedule => schedule?.currentStock > 10);
          break;
        default:
          break;
      }
    }

    setFilteredSchedules(filtered);
  }, [schedules, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      patient: '',
      status: '',
      stock: ''
    });
  };

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev?.filter(s => s?.id !== scheduleId));
      
      // Show notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Schedule Deleted', {
          body: 'Medication schedule has been successfully deleted.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleMarkTaken = (scheduleId) => {
    setSchedules(prev => prev?.map(schedule => {
      if (schedule?.id === scheduleId) {
        const updatedSchedule = {
          ...schedule,
          status: 'taken',
          lastTaken: new Date()?.toLocaleString(),
          currentStock: Math.max(0, schedule?.currentStock - 1)
        };
        
        // Show notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Medication Taken', {
            body: `${schedule.medicationName} marked as taken for ${schedule.patientName}`,
            icon: '/favicon.ico'
          });
        }
        
        return updatedSchedule;
      }
      return schedule;
    }));
  };

  const handleMarkUntaken = (scheduleId) => {
    setSchedules(prev => prev?.map(schedule => {
      if (schedule?.id === scheduleId) {
        return {
          ...schedule,
          status: 'pending',
          currentStock: schedule?.currentStock + 1
        };
      }
      return schedule;
    }));
  };

  const handleFormSubmit = (scheduleData) => {
    if (editingSchedule) {
      // Update existing schedule
      setSchedules(prev => prev?.map(s => 
        s?.id === editingSchedule?.id ? scheduleData : s
      ));
      
      // Show notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Schedule Updated', {
          body: `${scheduleData.medicationName} schedule has been updated.`,
          icon: '/favicon.ico'
        });
      }
    } else {
      // Add new schedule
      setSchedules(prev => [...prev, scheduleData]);
      
      // Show notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Schedule Created', {
          body: `New medication schedule created for ${scheduleData.patientName}`,
          icon: '/favicon.ico'
        });
      }
    }
    
    setIsFormOpen(false);
    setEditingSchedule(null);
  };

  // Alert counts for sidebar
  const alertCounts = {
    schedules: schedules?.filter(s => s?.currentStock <= 10)?.length,
    activity: schedules?.filter(s => s?.status === 'missed')?.length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isMobileMenuOpen}
        onToggle={handleMobileMenuToggle}
        alertCounts={alertCounts}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-280'}`}>
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* Page Content */}
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Medication Schedules</h1>
                <p className="text-muted-foreground">
                  Manage medication schedules, track dispensing, and monitor stock levels
                </p>
              </div>
              
              <Button
                variant="default"
                onClick={handleCreateSchedule}
                iconName="Plus"
                iconPosition="left"
                className="mt-4 sm:mt-0"
              >
                Create New Schedule
              </Button>
            </div>

            {/* Notification Permission Banner */}
            <NotificationPermission />

            {/* Stats Overview */}
            <StatsOverview schedules={schedules} />

            {/* Filter Controls */}
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              patients={patients}
              scheduleCount={filteredSchedules?.length}
            />

            {/* Schedules Grid */}
            {filteredSchedules?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchedules?.map(schedule => (
                  <ScheduleCard
                    key={schedule?.id}
                    schedule={schedule}
                    onEdit={handleEditSchedule}
                    onDelete={handleDeleteSchedule}
                    onMarkTaken={handleMarkTaken}
                    onMarkUntaken={handleMarkUntaken}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Calendar" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No schedules found</h3>
                <p className="text-muted-foreground mb-4">
                  {Object.values(filters)?.some(f => f) 
                    ? 'Try adjusting your filters or search terms' :'Create your first medication schedule to get started'
                  }
                </p>
                {!Object.values(filters)?.some(f => f) && (
                  <Button
                    variant="default"
                    onClick={handleCreateSchedule}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create Schedule
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Schedule Form Modal */}
      <ScheduleForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSchedule(null);
        }}
        onSubmit={handleFormSubmit}
        editingSchedule={editingSchedule}
        patients={patients}
      />
    </div>
  );
};

export default MedicationSchedules;