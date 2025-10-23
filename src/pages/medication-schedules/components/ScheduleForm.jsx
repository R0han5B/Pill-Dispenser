import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScheduleForm = ({ isOpen, onClose, onSubmit, editingSchedule, patients }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: 'daily',
    timing: '',
    instructions: '',
    currentStock: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        patientId: editingSchedule?.patientId || '',
        medicationName: editingSchedule?.medicationName || '',
        dosage: editingSchedule?.dosage || '',
        frequency: editingSchedule?.frequency || 'daily',
        timing: editingSchedule?.timing || '',
        instructions: editingSchedule?.instructions || '',
        currentStock: editingSchedule?.currentStock?.toString() || ''
      });
    } else {
      setFormData({
        patientId: '',
        medicationName: '',
        dosage: '',
        frequency: 'daily',
        timing: '',
        instructions: '',
        currentStock: ''
      });
    }
    setErrors({});
  }, [editingSchedule, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.patientId) newErrors.patientId = 'Please select a patient';
    if (!formData?.medicationName?.trim()) newErrors.medicationName = 'Medication name is required';
    if (!formData?.dosage?.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData?.timing?.trim()) newErrors.timing = 'Timing is required';
    if (!formData?.currentStock || formData?.currentStock < 1) {
      newErrors.currentStock = 'Stock must be at least 1 pill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    const scheduleData = {
      ...formData,
      currentStock: parseInt(formData?.currentStock),
      id: editingSchedule?.id || Date.now(),
      status: editingSchedule?.status || 'pending',
      deviceStatus: editingSchedule?.deviceStatus || 'online',
      createdAt: editingSchedule?.createdAt || new Date()?.toLocaleDateString(),
      lastTaken: editingSchedule?.lastTaken || null,
      nextDose: formData?.timing,
      patientName: patients?.find(p => p?.id === formData?.patientId)?.name || 'Unknown Patient'
    };

    onSubmit(scheduleData);
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as-needed', label: 'As Needed' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Patient *
            </label>
            <select
              name="patientId"
              value={formData?.patientId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a patient</option>
              {patients?.map(patient => (
                <option key={patient?.id} value={patient?.id}>
                  {patient?.name} - Age {patient?.age}
                </option>
              ))}
            </select>
            {errors?.patientId && (
              <p className="text-error text-sm mt-1">{errors?.patientId}</p>
            )}
          </div>

          {/* Medication Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Medication Name"
              type="text"
              name="medicationName"
              value={formData?.medicationName}
              onChange={handleInputChange}
              placeholder="e.g., Aspirin"
              error={errors?.medicationName}
              required
            />

            <Input
              label="Dosage"
              type="text"
              name="dosage"
              value={formData?.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 100mg"
              error={errors?.dosage}
              required
            />
          </div>

          {/* Timing and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timing"
              type="time"
              name="timing"
              value={formData?.timing}
              onChange={handleInputChange}
              error={errors?.timing}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Frequency *
              </label>
              <select
                name="frequency"
                value={formData?.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {frequencyOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock and Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Initial Stock Count"
              type="number"
              name="currentStock"
              value={formData?.currentStock}
              onChange={handleInputChange}
              placeholder="Number of pills"
              min="1"
              error={errors?.currentStock}
              required
            />

            <div className="md:col-span-1">
              <Input
                label="Instructions"
                type="text"
                name="instructions"
                value={formData?.instructions}
                onChange={handleInputChange}
                placeholder="Take with food, etc."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              iconName={editingSchedule ? "Save" : "Plus"}
              iconPosition="left"
            >
              {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;