import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PatientForm = ({ patient, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    medicalConditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [newCondition, setNewCondition] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Asthma',
    'Depression', 'Anxiety', 'High Cholesterol', 'Osteoporosis', 'COPD',
    'Alzheimer\'s', 'Parkinson\'s', 'Kidney Disease', 'Liver Disease'
  ];

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient?.name || '',
        age: patient?.age || '',
        medicalConditions: patient?.medicalConditions || [],
        emergencyContact: patient?.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        }
      });
    } else {
      setFormData({
        name: '',
        age: '',
        medicalConditions: [],
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!formData?.age || formData?.age < 1 || formData?.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (formData?.medicalConditions?.length === 0) {
      newErrors.medicalConditions = 'At least one medical condition is required';
    }

    if (!formData?.emergencyContact?.name?.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }

    if (!formData?.emergencyContact?.phone?.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.emergencyContact?.phone)) {
      newErrors.emergencyContactPhone = 'Please enter a valid phone number';
    }

    if (!formData?.emergencyContact?.relationship?.trim()) {
      newErrors.emergencyContactRelationship = 'Relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field?.startsWith('emergencyContact.')) {
      const contactField = field?.split('.')?.[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev?.emergencyContact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addCondition = (condition) => {
    if (condition && !formData?.medicalConditions?.includes(condition)) {
      setFormData(prev => ({
        ...prev,
        medicalConditions: [...prev?.medicalConditions, condition]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (conditionToRemove) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev?.medicalConditions?.filter(c => c !== conditionToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData?.age),
        id: patient?.id || Date.now(),
        createdAt: patient?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        avatar: patient?.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`,
        avatarAlt: `Professional headshot of ${formData?.name}`,
        activeSchedules: patient?.activeSchedules || 0,
        compliance: patient?.compliance || 85
      };

      await onSave(patientData);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <Input
              label="Patient Name"
              type="text"
              placeholder="Enter patient's full name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Age"
              type="number"
              placeholder="Enter age"
              value={formData?.age}
              onChange={(e) => handleInputChange('age', e?.target?.value)}
              error={errors?.age}
              min="1"
              max="120"
              required
            />
          </div>

          {/* Medical Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Medical Conditions</h3>
            
            {/* Add Condition */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add medical condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e?.target?.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => addCondition(newCondition)}
                disabled={!newCondition?.trim()}
                iconName="Plus"
              >
                Add
              </Button>
            </div>

            {/* Common Conditions */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Common conditions:</p>
              <div className="flex flex-wrap gap-2">
                {commonConditions?.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addCondition(condition)}
                    disabled={formData?.medicalConditions?.includes(condition)}
                    className="px-3 py-1 text-xs bg-secondary/10 text-secondary rounded-full hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Conditions */}
            {formData?.medicalConditions?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Selected conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {formData?.medicalConditions?.map((condition) => (
                    <span
                      key={condition}
                      className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="hover:text-error transition-colors"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {errors?.medicalConditions && (
              <p className="text-sm text-error">{errors?.medicalConditions}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Emergency Contact</h3>
            
            <Input
              label="Contact Name"
              type="text"
              placeholder="Enter emergency contact name"
              value={formData?.emergencyContact?.name}
              onChange={(e) => handleInputChange('emergencyContact.name', e?.target?.value)}
              error={errors?.emergencyContactName}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={formData?.emergencyContact?.phone}
              onChange={(e) => handleInputChange('emergencyContact.phone', e?.target?.value)}
              error={errors?.emergencyContactPhone}
              required
            />

            <Input
              label="Relationship"
              type="text"
              placeholder="e.g., Spouse, Child, Sibling"
              value={formData?.emergencyContact?.relationship}
              onChange={(e) => handleInputChange('emergencyContact.relationship', e?.target?.value)}
              error={errors?.emergencyContactRelationship}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {patient ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;