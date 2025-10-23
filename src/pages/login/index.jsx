import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('smartpill_user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data based on credentials
      const userData = {
        id: credentials.email === 'demo@smartpill.com' ? 'demo-user' : 'caregiver-001',
        name: credentials.email === 'demo@smartpill.com' ? 'Demo User' : 'Sarah Johnson',
        email: credentials.email,
        role: credentials.email === 'demo@smartpill.com' ? 'Demo Caregiver' : 'Primary Caregiver',
        avatar: credentials.email === 'demo@smartpill.com' ?'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' :'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face',
        avatarAlt: credentials.email === 'demo@smartpill.com' ?'Professional headshot of woman with shoulder-length brown hair smiling at camera' :'Professional portrait of blonde woman in white medical coat with stethoscope',
        loginTime: new Date().toISOString(),
        permissions: ['read', 'write', 'delete'],
        isDemo: credentials.email === 'demo@smartpill.com'
      };

      // Store user data in localStorage
      localStorage.setItem('smartpill_user', JSON.stringify(userData));
      localStorage.setItem('smartpill_auth_token', 'mock-jwt-token-' + Date.now());
      
      // Navigate to dashboard will be handled by the form component
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <LoginHeader />
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        </div>
        
        {/* Footer */}
        <LoginFooter />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-foreground font-medium">Signing you in...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;