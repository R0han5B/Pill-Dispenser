import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';
import LoginRedirect from './components/LoginRedirect';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Trust Signals */}
        <div className="hidden lg:block space-y-8">
          {/* Logo and Branding */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Pill" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Pill Dispenser</h1>
                <p className="text-muted-foreground">Healthcare Management Platform</p>
              </div>
            </Link>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground leading-tight">
                Join Our Healthcare Community
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create your caregiver account to start managing medication schedules, monitoring patient compliance, and ensuring better health outcomes with our advanced IoT platform.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">What you'll get:</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: 'Users',
                    title: 'Patient Management',
                    description: 'Comprehensive patient profile management with medical history tracking'
                  },
                  {
                    icon: 'Calendar',
                    title: 'Smart Scheduling',
                    description: 'Automated medication schedules with real-time dispensing alerts'
                  },
                  {
                    icon: 'Activity',
                    title: 'Compliance Monitoring',
                    description: 'Real-time adherence tracking and detailed activity logging'
                  },
                  {
                    icon: 'Bell',
                    title: 'Instant Notifications',
                    description: 'Browser push notifications for medication reminders and alerts'
                  }
                ]?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <Icon name={feature?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature?.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Signals for Desktop */}
          <div className="lg:block hidden">
            <TrustSignals />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 lg:p-10">
            
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link to="/" className="inline-flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Icon name="Pill" size={20} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Smart Pill Dispenser</h1>
                  <p className="text-sm text-muted-foreground">Healthcare Platform</p>
                </div>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h2>
              <p className="text-muted-foreground">
                Join thousands of caregivers managing medication safely
              </p>
            </div>

            {/* Registration Form */}
            <RegistrationForm />

            {/* Mobile Trust Signals */}
            <div className="lg:hidden mt-8 pt-6 border-t border-border">
              <TrustSignals />
            </div>

            {/* Login Redirect */}
            <div className="mt-8">
              <LoginRedirect />
            </div>
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default RegisterPage;