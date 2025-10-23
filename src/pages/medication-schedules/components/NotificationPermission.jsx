import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPermission = () => {
  const [permission, setPermission] = useState('default');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setShowBanner(Notification.permission === 'default');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        setShowBanner(false);
        
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

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  // Don't show banner if dismissed or permission already granted/denied
  if (!showBanner || permission !== 'default') {
    return null;
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Bell" size={20} className="text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground mb-1">
            Enable Medication Reminders
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get browser notifications for medication schedules and low stock alerts to ensure you never miss a dose.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={requestPermission}
              iconName="Bell"
              iconPosition="left"
            >
              Enable Notifications
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissBanner}
              iconName="X"
              iconPosition="left"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={dismissBanner}
          className="flex-shrink-0"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPermission;