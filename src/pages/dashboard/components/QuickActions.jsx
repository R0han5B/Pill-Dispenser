import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Patient',
      description: 'Register a new patient profile',
      icon: 'UserPlus',
      color: 'blue',
      onClick: () => navigate('/patient-management')
    },
    {
      title: 'Create Schedule',
      description: 'Set up medication schedule',
      icon: 'Calendar',
      color: 'green',
      onClick: () => navigate('/medication-schedules')
    },
    {
      title: 'View Reports',
      description: 'Check activity logs and reports',
      icon: 'BarChart3',
      color: 'purple',
      onClick: () => navigate('/activity-log')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center text-center hover:shadow-md transition-all duration-200"
            onClick={action?.onClick}
            iconName={action?.icon}
          >
            <div className="mb-2">
              <h4 className="font-medium text-foreground">{action?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;