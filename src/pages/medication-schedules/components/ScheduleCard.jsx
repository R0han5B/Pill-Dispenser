import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const ScheduleCard = ({ schedule, onEdit, onDelete, onMarkTaken, onMarkUntaken }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'missed':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStockStatusColor = (stock) => {
    if (stock <= 5) return 'text-error';
    if (stock <= 10) return 'text-warning';
    return 'text-success';
  };

  const isLowStock = schedule?.currentStock <= 10;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{schedule?.medicationName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule?.status)}`}>
              {schedule?.status?.charAt(0)?.toUpperCase() + schedule?.status?.slice(1)}
            </span>
            {isLowStock && (
              <span className="px-2 py-1 bg-error text-error-foreground rounded-full text-xs font-medium animate-pulse-status">
                Low Stock
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">Patient: {schedule?.patientName}</p>
          <p className="text-sm text-muted-foreground">Dosage: {schedule?.dosage}</p>
        </div>
        
        {/* ESP32 Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${schedule?.deviceStatus === 'online' ? 'bg-success animate-pulse-status' : 'bg-error'}`} />
          <span className="text-xs text-muted-foreground">
            {schedule?.deviceStatus === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      {/* Schedule Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Next Dose</p>
          <p className="text-sm font-medium text-foreground">{schedule?.nextDose}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Frequency</p>
          <p className="text-sm font-medium text-foreground">{schedule?.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Stock Level</p>
          <p className={`text-sm font-medium ${getStockStatusColor(schedule?.currentStock)}`}>
            {schedule?.currentStock} pills
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last Taken</p>
          <p className="text-sm font-medium text-foreground">{schedule?.lastTaken || 'Never'}</p>
        </div>
      </div>
      {/* Expandable Details */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mb-3"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      {/* Action Buttons */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
          {schedule?.status === 'pending' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onMarkTaken(schedule?.id)}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Mark Taken
            </Button>
          )}
          
          {schedule?.status === 'taken' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkUntaken(schedule?.id)}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Mark Untaken
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(schedule)}
            iconName="Edit"
            iconPosition="left"
            className="flex-1"
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(schedule?.id)}
            iconName="Trash2"
            iconPosition="left"
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
      {/* Additional Info for Expanded View */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border lg:hidden">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Instructions:</span>
              <span className="text-xs text-foreground">{schedule?.instructions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Created:</span>
              <span className="text-xs text-foreground">{schedule?.createdAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;