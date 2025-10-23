import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  patients,
  scheduleCount 
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'taken', label: 'Taken' },
    { value: 'missed', label: 'Missed' }
  ];

  const stockOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'low', label: 'Low Stock (≤10)' },
    { value: 'critical', label: 'Critical (≤5)' },
    { value: 'normal', label: 'Normal Stock' }
  ];

  const hasActiveFilters = filters?.patient || filters?.status || filters?.stock || filters?.search;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search medications..."
              value={filters?.search}
              onChange={(e) => onFilterChange('search', e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Patient Filter */}
          <select
            value={filters?.patient}
            onChange={(e) => onFilterChange('patient', e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[150px]"
          >
            <option value="">All Patients</option>
            {patients?.map(patient => (
              <option key={patient?.id} value={patient?.id}>
                {patient?.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters?.status}
            onChange={(e) => onFilterChange('status', e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px]"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={filters?.stock}
            onChange={(e) => onFilterChange('stock', e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
          >
            {stockOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results and Clear Filters */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-sm text-muted-foreground">
            {scheduleCount} schedule{scheduleCount !== 1 ? 's' : ''} found
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {filters?.search && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              Search: "{filters?.search}"
              <button
                onClick={() => onFilterChange('search', '')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.patient && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary rounded-md text-sm">
              Patient: {patients?.find(p => p?.id === filters?.patient)?.name}
              <button
                onClick={() => onFilterChange('patient', '')}
                className="ml-1 hover:text-secondary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.status && (
            <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent rounded-md text-sm">
              Status: {statusOptions?.find(s => s?.value === filters?.status)?.label}
              <button
                onClick={() => onFilterChange('status', '')}
                className="ml-1 hover:text-accent/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filters?.stock && (
            <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning rounded-md text-sm">
              Stock: {stockOptions?.find(s => s?.value === filters?.stock)?.label}
              <button
                onClick={() => onFilterChange('stock', '')}
                className="ml-1 hover:text-warning/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;