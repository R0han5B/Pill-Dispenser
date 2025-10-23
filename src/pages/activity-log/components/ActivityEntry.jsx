import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityEntry = ({ activity, onViewDetails }) => {
  const getEventIcon = (eventType) => {
    const iconMap = {
      'medication-dispensed': 'Pill',
      'medication-missed': 'AlertTriangle',
      'low-stock-alert': 'Package',
      'device-status': 'Wifi',
      'schedule-updated': 'Calendar',
      'system-notification': 'Bell'
    };
    return iconMap?.[eventType] || 'Activity';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20',
      info: 'text-primary bg-primary/10 border-primary/20'
    };
    return colorMap?.[status] || 'text-muted-foreground bg-muted border-border';
  };

  const getEventTypeLabel = (eventType) => {
    const labelMap = {
      'medication-dispensed': 'Medication Dispensed',
      'medication-missed': 'Medication Missed',
      'low-stock-alert': 'Low Stock Alert',
      'device-status': 'Device Status',
      'schedule-updated': 'Schedule Updated',
      'system-notification': 'System Notification'
    };
    return labelMap?.[eventType] || 'Unknown Event';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Event Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${getStatusColor(activity?.status)}`}>
          <Icon name={getEventIcon(activity?.eventType)} size={20} />
        </div>

        {/* Event Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {getEventTypeLabel(activity?.eventType)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activity?.patientName && (
                  <span className="font-medium text-foreground">{activity?.patientName}</span>
                )}
                {activity?.patientName && activity?.medicationName && ' • '}
                {activity?.medicationName && (
                  <span>{activity?.medicationName}</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(activity?.timestamp)}
              </span>
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(activity)}
                  iconName="ExternalLink"
                  iconSize={14}
                >
                  <span className="sr-only">View details</span>
                </Button>
              )}
            </div>
          </div>

          {/* Event Description */}
          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {activity?.description}
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {activity?.dosage && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Pill" size={12} />
                <span>{activity?.dosage}</span>
              </div>
            )}

            {activity?.deviceId && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Smartphone" size={12} />
                <span>Device {activity?.deviceId}</span>
              </div>
            )}

            {activity?.stockLevel !== undefined && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Package" size={12} />
                <span>{activity?.stockLevel} pills remaining</span>
              </div>
            )}

            {activity?.scheduleTime && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>Scheduled: {activity?.scheduleTime}</span>
              </div>
            )}
          </div>

          {/* Additional Actions for Critical Events */}
          {(activity?.status === 'error' || activity?.status === 'warning') && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                {activity?.eventType === 'medication-missed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Clock"
                    iconPosition="left"
                  >
                    Reschedule
                  </Button>
                )}
                
                {activity?.eventType === 'low-stock-alert' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Restock
                  </Button>
                )}

                {activity?.eventType === 'device-status' && activity?.status === 'error' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Reconnect
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityEntry;