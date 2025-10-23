import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'Award',
      title: 'HIPAA Compliant',
      description: 'Healthcare privacy standards certified'
    },
    {
      icon: 'Lock',
      title: 'Secure Platform',
      description: 'Bank-level security for your peace of mind'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={badge?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">{badge?.title}</h4>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Medical Compliance */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-0.5">
            <Icon name="Heart" size={14} className="text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Healthcare Certified</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our platform meets strict healthcare industry standards for patient data protection and medication management compliance.
            </p>
          </div>
        </div>
      </div>
      {/* Security Features */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Security Features</h4>
        <div className="space-y-2">
          {[
            'End-to-end encryption',
            'Two-factor authentication',
            'Regular security audits',
            'GDPR compliant'
          ]?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;