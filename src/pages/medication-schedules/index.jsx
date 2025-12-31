// src/pages/medication-schedules/index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
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

  // layout / UI states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // user state
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  // data states
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // modal / form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // filters / UI control
  const [filters, setFilters] = useState({
    search: '',
    patient: '',
    status: '',
    stock: '' // 'low' | 'critical' | 'normal' | ''
  });

  // loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Fetch User ----------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate('/login');
          return;
        }

        setUserId(authUser.id);

        // Get user metadata - refresh to get latest
        const { data: { user: refreshedUser } } = await supabase.auth.refreshSession();
        const currentUser = refreshedUser || authUser;
        
        const name = currentUser.user_metadata?.name || currentUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '';
        const role = currentUser.user_metadata?.role || 'Caregiver';
        
        const userData = {
          id: currentUser.id,
          email: currentUser.email || '',
          name: name,
          role: role
        };

        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  // ---------- Fetching ----------
  const fetchPatients = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, age')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error('fetchPatients error', err);
    }
  }, [userId]);

  const fetchSchedules = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      // Fetch relevant schedule fields - FILTERED BY USER
      const { data, error } = await supabase
        .from('medication_schedules')
        .select(`
          id,
          patient_id,
          patient_name,
          medication_name,
          dosage,
          frequency,
          timing,
          next_dose,
          instructions,
          current_stock,
          status,
          device_status,
          created_at,
          last_taken
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error('fetchSchedules error', err);
      setError('Failed to load schedules.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ---------- Realtime subscription ----------
  useEffect(() => {
    if (!userId) return;

    // initial fetch
    fetchPatients();
    fetchSchedules();

    // Realtime subscription for medication_schedules
    const channel = supabase
      .channel('realtime:medication_schedules')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medication_schedules' },
        (payload) => {
          // Only process if it's for current user
          if (payload.new?.user_id === userId || payload.old?.user_id === userId) {
            setSchedules(prev => {
              if (!prev) prev = [];
              switch (payload.eventType) {
                case 'INSERT':
                  return [payload.new, ...prev];
                case 'UPDATE':
                  return prev.map(s => (s.id === payload.new.id ? payload.new : s));
                case 'DELETE':
                  return prev.filter(s => s.id !== payload.old.id);
                default:
                  return prev;
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchPatients, fetchSchedules]);

  // ---------- Filters logic ----------
  useEffect(() => {
    let list = [...schedules];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s =>
        (s.medication_name || s.medication_name === 0 ? s.medication_name.toLowerCase() : '')
          .includes(q) ||
        (s.patient_name || '').toLowerCase().includes(q) ||
        (s.instructions || '').toLowerCase().includes(q)
      );
    }

    if (filters.patient) {
      list = list.filter(s => String(s.patient_id) === String(filters.patient));
    }

    if (filters.status) {
      list = list.filter(s => s.status === filters.status);
    }

    if (filters.stock) {
      switch (filters.stock) {
        case 'low':
          list = list.filter(s => (s.current_stock ?? 0) <= 10 && (s.current_stock ?? 0) > 5);
          break;
        case 'critical':
          list = list.filter(s => (s.current_stock ?? 0) <= 5);
          break;
        case 'normal':
          list = list.filter(s => (s.current_stock ?? 0) > 10);
          break;
        default:
          break;
      }
    }

    setFilteredSchedules(list);
  }, [schedules, filters]);

  // ---------- Actions: create / update / delete / mark taken ----------
  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const { error } = await supabase.from('medication_schedules').delete().eq('id', scheduleId);
      if (error) throw error;
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    } catch (err) {
      console.error('delete schedule error', err);
      alert('Failed to delete schedule.');
    }
  };

  const handleMarkTaken = async (scheduleId) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      const updated = {
        status: 'taken',
        last_taken: new Date().toISOString(),
        current_stock: Math.max(0, (schedule.current_stock ?? 0) - 1),
      };

      const { error } = await supabase
        .from('medication_schedules')
        .update(updated)
        .eq('id', scheduleId);

      if (error) throw error;

      // trigger notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Medication Taken', {
          body: `${schedule.medication_name} marked taken for ${schedule.patient_name}`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error('markTaken error', err);
      alert('Could not mark as taken.');
    }
  };

  const handleMarkUntaken = async (scheduleId) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      const updated = {
        status: 'pending',
        current_stock: (schedule.current_stock ?? 0) + 1,
      };

      const { error } = await supabase
        .from('medication_schedules')
        .update(updated)
        .eq('id', scheduleId);

      if (error) throw error;
    } catch (err) {
      console.error('markUntaken error', err);
      alert('Could not mark as untaken.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const dataWithUserId = { ...formData, user_id: userId };

      if (editingSchedule) {
        // update
        const { error } = await supabase
          .from('medication_schedules')
          .update(dataWithUserId)
          .eq('id', editingSchedule.id);
        if (error) throw error;
      } else {
        // insert
        const insertData = {
          ...dataWithUserId,
          created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('medication_schedules').insert([insertData]);
        if (error) throw error;
      }
      setIsFormOpen(false);
      setEditingSchedule(null);
    } catch (err) {
      console.error('form submit error', err);
      alert('Failed to save schedule.');
    }
  };

  // ---------- Helper UI handlers ----------
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const handleFilterChange = (type, value) =>
    setFilters(prev => ({ ...prev, [type]: value }));

  const handleClearFilters = () =>
    setFilters({ search: '', patient: '', status: '', stock: '' });

  // ---------- Derived / stats ----------
  const alertCounts = {
    schedules: schedules.filter(s => (s.current_stock ?? 0) <= 10).length,
    activity: schedules.filter(s => s.status === 'missed').length
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isMobileMenuOpen}
        onToggle={handleMobileMenuToggle}
        alertCounts={alertCounts}
      />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-280'}`}>
        <Header
          user={user}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Medication Schedules</h1>
                <p className="text-muted-foreground">
                  Manage medication schedules, track dispensing, and monitor stock levels.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate('/patient-management')}
                  iconName="Users"
                  iconPosition="left"
                >
                  Patients
                </Button>

                <Button
                  variant="default"
                  onClick={handleCreateSchedule}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create New Schedule
                </Button>
              </div>
            </div>

            <NotificationPermission />

            <StatsOverview schedules={schedules} />

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              patients={patients}
              scheduleCount={filteredSchedules.length}
            />

            {/* Content */}
            {loading ? (
              <div className="py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-card border border-border rounded-lg p-4 h-40" />
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">{error}</div>
            ) : filteredSchedules.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchedules.map(schedule => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => handleEditSchedule(schedule)}
                    onDelete={() => handleDeleteSchedule(schedule.id)}
                    onMarkTaken={() => handleMarkTaken(schedule.id)}
                    onMarkUntaken={() => handleMarkUntaken(schedule.id)}
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
                  {Object.values(filters).some(f => f)
                    ? 'Try adjusting your filters or search terms.'
                    : 'Create your first medication schedule to get started.'}
                </p>
                {!Object.values(filters).some(f => f) && (
                  <Button variant="default" onClick={handleCreateSchedule} iconName="Plus" iconPosition="left">
                    Create Schedule
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

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