import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default (not granted or denied)
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        setShowPrompt(false);
        
        if (result === 'granted') {
          // Show a test notification
          new Notification('Smart Pill Dispenser', {
            body: 'Notifications enabled! You\'ll receive medication reminders.',
            icon: '/favicon.ico'
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Bell" size={18} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Enable Medication Reminders
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Get timely notifications for medication schedules and low stock alerts to ensure better patient care.
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              size="sm"
              onClick={requestPermission}
              iconName="Check"
              iconPosition="left"
              iconSize={16}
            >
              Enable Notifications
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissPrompt}
              className="text-blue-600 hover:text-blue-700"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={dismissPrompt}
          className="text-blue-600 hover:text-blue-700"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPrompt;