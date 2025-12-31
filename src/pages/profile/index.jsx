import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // User State
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate('/login');
          return;
        }

        // Get user metadata
        const name = authUser.user_metadata?.name || authUser.user_metadata?.full_name || '';
        const role = authUser.user_metadata?.role || '';
        
        const userData = {
          id: authUser.id,
          email: authUser.email || '',
          name: name,
          role: role,
          phone: authUser.phone || '',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at
        };

        setUser(userData);
        setProfileData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone
        });
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          role: profileData.role
        }
      });

      if (error) throw error;

      // Update phone if supported
      if (profileData.phone !== user.phone) {
        const { error: phoneError } = await supabase.auth.updateUser({
          phone: profileData.phone
        });
        if (phoneError) console.error('Phone update error:', phoneError);
      }

      setUser(prev => ({ ...prev, ...profileData }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - Smart Pill Dispenser</title>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
                  <p className="text-muted-foreground">
                    Manage your personal information and account settings
                  </p>
                </div>

                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    iconName="Edit"
                    iconPosition="left"
                    className="mt-4 sm:mt-0"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      iconName="Check"
                      iconPosition="left"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center text-muted-foreground py-10">
                  Loading profile...
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg shadow-sm">
                  {/* Profile Picture Section */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary-foreground">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {user?.name || 'User'}
                        </h2>
                        <p className="text-muted-foreground">{user?.role || 'Caregiver'}</p>
                        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-lg text-foreground">
                            {user?.name || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <div className="p-3 bg-muted rounded-lg text-muted-foreground">
                          {user?.email || 'Not set'}
                          <span className="ml-2 text-xs">(Cannot be changed)</span>
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Role
                        </label>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="role"
                            value={profileData.role}
                            onChange={handleInputChange}
                            placeholder="e.g., Caregiver, Nurse"
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-lg text-foreground">
                            {user?.role || 'Not set'}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <Input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-lg text-foreground">
                            {user?.phone || 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="p-6 border-t border-border bg-muted/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Icon name="Shield" size={20} className="mr-2" />
                      Account Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Created:</span>
                        <span className="text-foreground font-medium">
                          {user?.created_at 
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="text-foreground font-medium">
                          {user?.updated_at 
                            ? new Date(user.updated_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
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

export default Profile;