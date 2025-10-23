import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginRedirect = () => {
  return (
    <div className="text-center space-y-4">
      <div className="h-px bg-border"></div>
      
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <span>Already have an account?</span>
        <Link 
          to="/login" 
          className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 flex items-center space-x-1"
        >
          <span>Sign in here</span>
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>

      {/* Additional Help Links */}
      <div className="pt-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <Link 
            to="/help" 
            className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="HelpCircle" size={12} />
            <span>Need Help?</span>
          </Link>
          <span>•</span>
          <Link 
            to="/contact" 
            className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="MessageCircle" size={12} />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRedirect;