import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getComplianceColor = (compliance) => {
    if (compliance >= 90) return 'text-success bg-success/10';
    if (compliance >= 70) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getComplianceIcon = (compliance) => {
    if (compliance >= 90) return 'CheckCircle';
    if (compliance >= 70) return 'AlertTriangle';
    return 'XCircle';
  };

  const handleViewSchedules = () => {
    navigate('/medication-schedules', { state: { patientId: patient?.id } });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={patient?.avatar}
              alt={patient?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{patient?.name}</h3>
            <p className="text-sm text-muted-foreground">Age: {patient?.age}</p>
            <p className="text-xs text-muted-foreground">
              Added: {new Date(patient.createdAt)?.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(patient)}
            title="Edit patient"
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(patient?.id)}
            title="Delete patient"
            className="text-error hover:text-error hover:bg-error/10"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Medical Conditions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Medical Conditions</h4>
        <div className="flex flex-wrap gap-2">
          {patient?.medicalConditions?.map((condition, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-1">Emergency Contact</h4>
        <p className="text-sm text-muted-foreground">{patient?.emergencyContact?.name}</p>
        <p className="text-sm text-muted-foreground">{patient?.emergencyContact?.phone}</p>
        <p className="text-xs text-muted-foreground">{patient?.emergencyContact?.relationship}</p>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <div className="text-2xl font-bold text-primary">{patient?.activeSchedules}</div>
          <div className="text-xs text-muted-foreground">Active Schedules</div>
        </div>
        <div className="text-center p-3 bg-accent/5 rounded-lg">
          <div className={`text-2xl font-bold ${getComplianceColor(patient?.compliance)?.split(' ')?.[0]}`}>
            {patient?.compliance}%
          </div>
          <div className="text-xs text-muted-foreground">Compliance</div>
        </div>
      </div>
      {/* Compliance Status */}
      <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${getComplianceColor(patient?.compliance)}`}>
        <Icon name={getComplianceIcon(patient?.compliance)} size={16} />
        <span className="text-sm font-medium">
          {patient?.compliance >= 90 ? 'Excellent Compliance' : 
           patient?.compliance >= 70 ? 'Good Compliance' : 'Needs Attention'}
        </span>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewSchedules}
          iconName="Calendar"
          iconPosition="left"
        >
          View Schedules
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={() => navigate('/activity-log', { state: { patientId: patient?.id } })}
          iconName="Activity"
          iconPosition="left"
        >
          Activity Log
        </Button>
      </div>
    </div>
  );
};

export default PatientCard;