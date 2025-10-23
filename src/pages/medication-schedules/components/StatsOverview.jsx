import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ schedules }) => {
  const totalSchedules = schedules?.length;
  const pendingSchedules = schedules?.filter(s => s?.status === 'pending')?.length;
  const takenToday = schedules?.filter(s => s?.status === 'taken')?.length;
  const lowStockCount = schedules?.filter(s => s?.currentStock <= 10)?.length;
  const criticalStockCount = schedules?.filter(s => s?.currentStock <= 5)?.length;
  const offlineDevices = schedules?.filter(s => s?.deviceStatus === 'offline')?.length;

  const stats = [
    {
      title: 'Total Schedules',
      value: totalSchedules,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending Today',
      value: pendingSchedules,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Taken Today',
      value: takenToday,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Critical Stock',
      value: criticalStockCount,
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Offline Devices',
      value: offlineDevices,
      icon: 'WifiOff',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground truncate">{stat?.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;