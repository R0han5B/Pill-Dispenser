import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ActivityFilters = ({ onFilterChange, onExport, totalActivities }) => {
  const [filters, setFilters] = useState({
    patient: '',
    eventType: '',
    dateRange: '',
    status: '',
    searchQuery: ''
  });

  const patientOptions = [
    { value: '', label: 'All Patients' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'mary-smith', label: 'Mary Smith' },
    { value: 'robert-johnson', label: 'Robert Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' }
  ];

  const eventTypeOptions = [
    { value: '', label: 'All Events' },
    { value: 'medication-dispensed', label: 'Medication Dispensed' },
    { value: 'medication-missed', label: 'Medication Missed' },
    { value: 'low-stock-alert', label: 'Low Stock Alert' },
    { value: 'device-status', label: 'Device Status' },
    { value: 'schedule-updated', label: 'Schedule Updated' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'this-month', label: 'This Month' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'info', label: 'Information' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      patient: '',
      eventType: '',
      dateRange: '',
      status: '',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Activity Filters</h2>
          <p className="text-sm text-muted-foreground">
            Filter and search through {totalActivities} activity records
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Report
          </Button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search activities by patient name, medication, or event details..."
          value={filters?.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Patient"
          options={patientOptions}
          value={filters?.patient}
          onChange={(value) => handleFilterChange('patient', value)}
          placeholder="Select patient"
        />

        <Select
          label="Event Type"
          options={eventTypeOptions}
          value={filters?.eventType}
          onChange={(value) => handleFilterChange('eventType', value)}
          placeholder="Select event type"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Select date range"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Select status"
        />
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">Active filters:</span>
            
            {filters?.patient && (
              <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span>Patient: {patientOptions?.find(p => p?.value === filters?.patient)?.label}</span>
                <button
                  onClick={() => handleFilterChange('patient', '')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {filters?.eventType && (
              <div className="flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                <span>Type: {eventTypeOptions?.find(e => e?.value === filters?.eventType)?.label}</span>
                <button
                  onClick={() => handleFilterChange('eventType', '')}
                  className="ml-2 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {filters?.dateRange && (
              <div className="flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                <span>Date: {dateRangeOptions?.find(d => d?.value === filters?.dateRange)?.label}</span>
                <button
                  onClick={() => handleFilterChange('dateRange', '')}
                  className="ml-2 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {filters?.status && (
              <div className="flex items-center bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">
                <span>Status: {statusOptions?.find(s => s?.value === filters?.status)?.label}</span>
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 hover:bg-warning/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}

            {filters?.searchQuery && (
              <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                <span>Search: "{filters?.searchQuery}"</span>
                <button
                  onClick={() => handleFilterChange('searchQuery', '')}
                  className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFilters;