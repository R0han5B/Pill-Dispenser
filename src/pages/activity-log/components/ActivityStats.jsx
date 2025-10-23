import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Events',
      value: stats?.totalEvents,
      icon: 'Activity',
      color: 'text-primary bg-primary/10 border-primary/20',
      description: 'All recorded activities'
    },
    {
      title: 'Medications Dispensed',
      value: stats?.medicationsDispensed,
      icon: 'Pill',
      color: 'text-success bg-success/10 border-success/20',
      description: 'Successfully dispensed today'
    },
    {
      title: 'Missed Doses',
      value: stats?.missedDoses,
      icon: 'AlertTriangle',
      color: 'text-error bg-error/10 border-error/20',
      description: 'Requires attention'
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockAlerts,
      icon: 'Package',
      color: 'text-warning bg-warning/10 border-warning/20',
      description: 'Medications need restocking'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{stat?.title}</h3>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityStats;