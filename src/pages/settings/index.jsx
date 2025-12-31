import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    medicationReminders: true,
    lowStockAlerts: true,
    deviceAlerts: true
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, email, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        toast.error('Failed to load profile');
      } else {
        setUser(profile);
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification settings updated');
  };

  // Handle display setting change
  const handleDisplaySettingChange = (key, value) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Display settings updated');
  };

  // Handle password change
  const handleChangePassword = async () => {
    toast.info('Password change feature coming soon!');
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      toast.info('Account deletion feature coming soon!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - Smart Pill Dispenser</title>
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
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your application preferences and account settings
                </p>
              </div>

              {loading ? (
                <div className="text-center text-muted-foreground py-10">
                  Loading settings...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div className="bg-card border border-border rounded-lg shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold text-foreground flex items-center">
                        <Icon name="Bell" size={24} className="mr-3" />
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure how you want to receive notifications
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      {Object.entries({
                        emailNotifications: 'Email Notifications',
                        pushNotifications: 'Push Notifications',
                        medicationReminders: 'Medication Reminders',
                        lowStockAlerts: 'Low Stock Alerts',
                        deviceAlerts: 'Device Status Alerts'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Receive {label.toLowerCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notificationSettings[key] ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="bg-card border border-border rounded-lg shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold text-foreground flex items-center">
                        <Icon name="Monitor" size={24} className="mr-3" />
                        Display Settings
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Customize your viewing experience
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['light', 'dark', 'system'].map((theme) => (
                            <button
                              key={theme}
                              onClick={() => handleDisplaySettingChange('theme', theme)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                displaySettings.theme === theme
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <Icon 
                                  name={theme === 'light' ? 'Sun' : theme === 'dark' ? 'Moon' : 'Monitor'} 
                                  size={24} 
                                  className="mb-1"
                                />
                                <span className="text-sm font-medium capitalize">{theme}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Language
                        </label>
                        <select
                          value={displaySettings.language}
                          onChange={(e) => handleDisplaySettingChange('language', e.target.value)}
                          className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      {/* Date Format */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Date Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['MM/DD/YYYY', 'DD/MM/YYYY'].map((format) => (
                            <button
                              key={format}
                              onClick={() => handleDisplaySettingChange('dateFormat', format)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                displaySettings.dateFormat === format
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <span className="text-sm font-medium">{format}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Format */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Time Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: '12h', label: '12 Hour (AM/PM)' },
                            { value: '24h', label: '24 Hour' }
                          ].map((format) => (
                            <button
                              key={format.value}
                              onClick={() => handleDisplaySettingChange('timeFormat', format.value)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                displaySettings.timeFormat === format.value
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <span className="text-sm font-medium">{format.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-card border border-border rounded-lg shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold text-foreground flex items-center">
                        <Icon name="Shield" size={24} className="mr-3" />
                        Security
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage your account security settings
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <div>
                          <p className="font-medium text-foreground">Password</p>
                          <p className="text-sm text-muted-foreground">
                            Change your account password
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleChangePassword}
                          iconName="Lock"
                          iconPosition="left"
                        >
                          Change Password
                        </Button>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-foreground">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => toast.info('2FA feature coming soon!')}
                        >
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-card border border-error/50 rounded-lg shadow-sm">
                    <div className="p-6 border-b border-error/50 bg-error/5">
                      <h2 className="text-xl font-semibold text-error flex items-center">
                        <Icon name="AlertTriangle" size={24} className="mr-3" />
                        Danger Zone
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Irreversible actions for your account
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleDeleteAccount}
                          className="border-error text-error hover:bg-error hover:text-error-foreground"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Settings;
