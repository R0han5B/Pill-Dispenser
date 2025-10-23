import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      dispensed: 'CheckCircle',
      missed: 'XCircle',
      low_stock: 'AlertTriangle',
      added: 'Plus',
      updated: 'Edit',
      connected: 'Wifi',
      disconnected: 'WifiOff'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      dispensed: 'text-green-600 bg-green-50',
      missed: 'text-red-600 bg-red-50',
      low_stock: 'text-yellow-600 bg-yellow-50',
      added: 'text-blue-600 bg-blue-50',
      updated: 'text-purple-600 bg-purple-50',
      connected: 'text-green-600 bg-green-50',
      disconnected: 'text-red-600 bg-red-50'
    };
    return colorMap?.[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>{formatDate(activity?.timestamp)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTime(activity?.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;