import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-12 text-center space-y-6">
      {/* Security Features */}
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-green-600" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-blue-600" />
          <span>HIPAA Compliant</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-emerald-600" />
          <span>FDA Approved</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Footer Links */}
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <button className="hover:text-foreground transition-colors">
          Privacy Policy
        </button>
        <button className="hover:text-foreground transition-colors">
          Terms of Service
        </button>
        <button className="hover:text-foreground transition-colors">
          Support
        </button>
      </div>

      {/* Copyright */}
      <p className="text-xs text-muted-foreground">
        © {currentYear} Smart Pill Dispenser. All rights reserved.
      </p>
    </div>
  );
};

export default LoginFooter;