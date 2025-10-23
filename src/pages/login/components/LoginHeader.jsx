import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Pill" size={32} color="white" />
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Welcome Back
      </h1>
      <p className="text-muted-foreground text-lg">
        Sign in to your Smart Pill Dispenser account
      </p>
      
      {/* Subtitle */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          Secure medication management for caregivers and healthcare providers
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;