import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onAddPatient, hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No patients found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No patients match your current search criteria. Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Users" size={32} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-3">No patients yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Get started by adding your first patient. You'll be able to manage their medication schedules, 
        track compliance, and monitor their health progress.
      </p>
      
      <div className="space-y-4">
        <Button
          onClick={onAddPatient}
          iconName="Plus"
          iconPosition="left"
          className="px-8"
        >
          Add Your First Patient
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p>Need help getting started?</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="text-primary hover:underline flex items-center space-x-1">
              <Icon name="HelpCircle" size={14} />
              <span>View Guide</span>
            </button>
            <button className="text-primary hover:underline flex items-center space-x-1">
              <Icon name="Video" size={14} />
              <span>Watch Tutorial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;