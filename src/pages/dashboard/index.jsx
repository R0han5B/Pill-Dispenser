import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import DeviceStatus from './components/DeviceStatus';
import QuickActions from './components/QuickActions';
import NotificationPrompt from './components/NotificationPrompt';
import ActivityFeed from '../activity-log/components/ActivityEntry';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User State
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  
  const [metrics, setMetrics] = useState({
    totalSchedules: 0,
    dispensedToday: 0,
    lowStockAlerts: 0,
    totalPatients: 0
  });
  const [activities, setActivities] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
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
        const user = refreshedUser || authUser;
        
        const name = user.user_metadata?.name || user.user_metadata?.full_name || authUser.email?.split('@')[0] || '';
        const role = user.user_metadata?.role || 'Caregiver';
        
        const userData = {
          id: user.id,
          email: user.email || '',
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

  useEffect(() => {
    if (!userId) return; // Wait for userId to be set

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 🧩 Fetch counts - FILTERED BY CURRENT USER
        const { count: patientCount } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId); // Filter by current user

        const { count: scheduleCount } = await supabase
          .from('schedules')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId); // Filter by current user

        const { count: lowStockCount } = await supabase
          .from('medications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId) // Filter by current user
          .lte('stock', 10);

        const { data: dispensedToday } = await supabase
          .from('dispense_logs')
          .select('*')
          .eq('user_id', userId) // Filter by current user
          .gte('created_at', new Date().toISOString().split('T')[0]);

        // 🧩 Fetch latest activities - FILTERED BY CURRENT USER
        const { data: activityData } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', userId) // Filter by current user
          .order('created_at', { ascending: false })
          .limit(10);

        // 🧩 Fetch device status - FILTERED BY CURRENT USER
        const { data: deviceData } = await supabase
          .from('devices')
          .select('*')
          .eq('user_id', userId); // Filter by current user

        setMetrics({
          totalSchedules: scheduleCount || 0,
          dispensedToday: dispensedToday?.length || 0,
          lowStockAlerts: lowStockCount || 0,
          totalPatients: patientCount || 0
        });

        setActivities(activityData || []);
        setDevices(deviceData || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]); // Dependency on userId

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const metricsData = [
    {
      title: 'Total Schedules',
      value: metrics.totalSchedules,
      icon: 'Calendar',
      color: 'blue'
    },
    {
      title: 'Dispensed Today',
      value: metrics.dispensedToday,
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockAlerts,
      icon: 'AlertTriangle',
      color: 'red'
    },
    {
      title: 'Total Patients',
      value: metrics.totalPatients,
      icon: 'Users',
      color: 'purple'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Smart Pill Dispenser</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          alertCounts={{ schedules: 3, activity: 2 }}
        />

        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-280'
          }`}
        >
          <Header
            user={user}
            onLogout={handleLogout}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <main className="pt-16 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Real-time overview of your medication schedules, devices, and patient data.
                </p>
              </div>

              <NotificationPrompt />

              {/* Loading / No Data */}
              {loading ? (
                <div className="text-center text-gray-500 py-10">Loading data...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricsData.map((metric, index) => (
                      <MetricsCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        icon={metric.icon}
                        color={metric.color}
                      />
                    ))}
                  </div>

                  {/* Activities + Devices */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="lg:col-span-1">
                      {activities?.length > 0 ? (
                        <ActivityFeed activities={activities} />
                      ) : (
                        <div className="text-center text-gray-500 p-8 border rounded-lg">
                          No recent activities
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1">
                      {devices?.length > 0 ? (
                        <DeviceStatus devices={devices} />
                      ) : (
                        <div className="text-center text-gray-500 p-8 border rounded-lg">
                          No device data available
                        </div>
                      )}
                    </div>
                  </div>

                  <QuickActions />

                  <div className="bg-card border border-border rounded-lg p-4 mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-status" />
                        <span className="text-muted-foreground">System Online</span>
                      </div>
                      <span className="text-muted-foreground">
                        Last updated {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;