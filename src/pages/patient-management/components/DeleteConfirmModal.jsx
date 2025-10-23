import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmModal = ({ isOpen, patientName, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Delete Patient</h2>
            <p className="text-sm text-muted-foreground">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-foreground mb-4">
            Are you sure you want to delete <strong>{patientName}</strong>? This will permanently remove:
          </p>
          
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span>Patient profile and personal information</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>All medication schedules</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>Complete activity history</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Bell" size={16} />
              <span>All associated alerts and notifications</span>
            </li>
          </ul>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-error">Warning</p>
                <p className="text-xs text-error/80">
                  This action is permanent and cannot be reversed. All data associated with this patient will be lost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={isDeleting}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Patient
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;