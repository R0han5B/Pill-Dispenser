import React from 'react';
import Icon from '../../../components/AppIcon';

const DeviceStatus = ({ devices }) => {
  const getStatusColor = (status) => {
    return status === 'online' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status) => {
    return status === 'online' ? 'Wifi' : 'WifiOff';
  };

  const formatLastSeen = (timestamp) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Device Status</h3>
        <Icon name="Cpu" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {devices?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Cpu" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No devices connected</p>
          </div>
        ) : (
          devices?.map((device) => (
            <div key={device?.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(device?.status)}`}>
                  <Icon name={getStatusIcon(device?.status)} size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{device?.name}</h4>
                  <p className="text-xs text-muted-foreground">{device?.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse-status`} />
                  <span className={`text-xs font-medium ${device?.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                    {device?.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatLastSeen(device?.lastSeen)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {devices?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Devices</span>
            <span className="font-medium text-foreground">{devices?.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Online</span>
            <span className="font-medium text-green-600">
              {devices?.filter(d => d?.status === 'online')?.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceStatus;