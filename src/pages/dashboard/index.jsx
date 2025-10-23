import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import DeviceStatus from './components/DeviceStatus';
import QuickActions from './components/QuickActions';
import NotificationPrompt from './components/NotificationPrompt';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalSchedules: 0,
    dispensedToday: 0,
    lowStockAlerts: 0,
    totalPatients: 0
  });

  const [activities, setActivities] = useState([]);
  const [devices, setDevices] = useState([]);

  // Mock data initialization
  useEffect(() => {
    // Initialize metrics
    setMetrics({
      totalSchedules: 24,
      dispensedToday: 18,
      lowStockAlerts: 3,
      totalPatients: 8
    });

    // Initialize recent activities
    const mockActivities = [
      {
        id: 1,
        type: 'dispensed',
        title: 'Medication Dispensed',
        description: 'Lisinopril 10mg dispensed to John Smith',
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        id: 2,
        type: 'low_stock',
        title: 'Low Stock Alert',
        description: 'Metformin 500mg - Only 8 pills remaining',
        timestamp: new Date(Date.now() - 900000) // 15 minutes ago
      },
      {
        id: 3,
        type: 'missed',
        title: 'Missed Medication',
        description: 'Mary Johnson missed evening dose of Atorvastatin',
        timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
      },
      {
        id: 4,
        type: 'dispensed',
        title: 'Medication Dispensed',
        description: 'Amlodipine 5mg dispensed to Robert Davis',
        timestamp: new Date(Date.now() - 2700000) // 45 minutes ago
      },
      {
        id: 5,
        type: 'connected',
        title: 'Device Connected',
        description: 'ESP32 Device #001 came online',
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: 6,
        type: 'added',
        title: 'New Patient Added',
        description: 'Sarah Wilson profile created successfully',
        timestamp: new Date(Date.now() - 7200000) // 2 hours ago
      }
    ];
    setActivities(mockActivities);

    // Initialize device status
    const mockDevices = [
      {
        id: 'esp32_001',
        name: 'ESP32 Device #001',
        location: 'Living Room - Main Unit',
        status: 'online',
        lastSeen: new Date(Date.now() - 120000) // 2 minutes ago
      },
      {
        id: 'esp32_002',
        name: 'ESP32 Device #002',
        location: 'Bedroom - Secondary Unit',
        status: 'online',
        lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        id: 'esp32_003',
        name: 'ESP32 Device #003',
        location: 'Kitchen - Backup Unit',
        status: 'offline',
        lastSeen: new Date(Date.now() - 1800000) // 30 minutes ago
      }
    ];
    setDevices(mockDevices);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update device status
      setDevices(prevDevices => 
        prevDevices?.map(device => ({
          ...device,
          status: Math.random() > 0.1 ? 'online' : 'offline',
          lastSeen: device?.status === 'online' ? new Date() : device?.lastSeen
        }))
      );

      // Occasionally add new activities
      if (Math.random() > 0.7) {
        const newActivity = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'dispensed' : 'connected',
          title: Math.random() > 0.5 ? 'Medication Dispensed' : 'Device Status Update',
          description: Math.random() > 0.5 
            ? 'Automated medication dispensing completed' 
            : 'ESP32 device connectivity verified',
          timestamp: new Date()
        };
        
        setActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
        
        // Update metrics
        if (newActivity?.type === 'dispensed') {
          setMetrics(prev => ({
            ...prev,
            dispensedToday: prev?.dispensedToday + 1
          }));
        }
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      title: 'Total Schedules',
      value: metrics?.totalSchedules,
      icon: 'Calendar',
      color: 'blue',
      trend: 'up',
      trendValue: '+2 this week'
    },
    {
      title: 'Dispensed Today',
      value: metrics?.dispensedToday,
      icon: 'CheckCircle',
      color: 'green',
      trend: 'up',
      trendValue: '75% completion'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics?.lowStockAlerts,
      icon: 'AlertTriangle',
      color: 'red',
      trend: 'down',
      trendValue: '-1 from yesterday'
    },
    {
      title: 'Total Patients',
      value: metrics?.totalPatients,
      icon: 'Users',
      color: 'purple',
      trend: 'up',
      trendValue: '+1 this month'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Smart Pill Dispenser</title>
        <meta name="description" content="Comprehensive medication management dashboard with real-time monitoring and alerts" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor medication schedules, device status, and patient compliance in real-time
            </p>
          </div>

          {/* Notification Prompt */}
          <NotificationPrompt />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                icon={metric?.icon}
                color={metric?.color}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} />
            </div>

            {/* Device Status */}
            <div className="lg:col-span-1">
              <DeviceStatus devices={devices} />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* System Status Footer */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-status" />
                  <span className="text-muted-foreground">System Status: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium text-foreground">
                    {new Date()?.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="text-muted-foreground">
                Smart Pill Dispenser v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;