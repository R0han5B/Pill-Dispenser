import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchAndFilter = ({ onSearch, onFilter, totalPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Asthma',
    'Depression', 'Anxiety', 'High Cholesterol', 'Osteoporosis', 'COPD'
  ];

  const complianceOptions = [
    { value: '', label: 'All Compliance Levels' },
    { value: 'excellent', label: 'Excellent (90%+)' },
    { value: 'good', label: 'Good (70-89%)' },
    { value: 'needs-attention', label: 'Needs Attention (<70%)' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleConditionFilter = (condition) => {
    const newCondition = selectedCondition === condition ? '' : condition;
    setSelectedCondition(newCondition);
    applyFilters(newCondition, complianceFilter);
  };

  const handleComplianceFilter = (compliance) => {
    setComplianceFilter(compliance);
    applyFilters(selectedCondition, compliance);
  };

  const applyFilters = (condition, compliance) => {
    onFilter({
      medicalCondition: condition,
      compliance: compliance
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCondition('');
    setComplianceFilter('');
    onSearch('');
    onFilter({});
  };

  const hasActiveFilters = searchTerm || selectedCondition || complianceFilter;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            iconName="Filter"
            iconPosition="left"
          >
            Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          {totalPatients} {totalPatients === 1 ? 'patient' : 'patients'} found
        </span>
        
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={14} />
            <span>Filters active</span>
          </div>
        )}
      </div>
      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Medical Conditions Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Filter by Medical Condition</h4>
            <div className="flex flex-wrap gap-2">
              {medicalConditions?.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleConditionFilter(condition)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCondition === condition
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Filter by Compliance Level</h4>
            <div className="flex flex-wrap gap-2">
              {complianceOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleComplianceFilter(option?.value)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    complianceFilter === option?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-foreground mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    <span>Search: "{searchTerm}"</span>
                    <button onClick={() => handleSearchChange({ target: { value: '' } })}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {selectedCondition && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    <span>Condition: {selectedCondition}</span>
                    <button onClick={() => handleConditionFilter(selectedCondition)}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {complianceFilter && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    <span>
                      Compliance: {complianceOptions?.find(opt => opt?.value === complianceFilter)?.label}
                    </span>
                    <button onClick={() => handleComplianceFilter('')}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;