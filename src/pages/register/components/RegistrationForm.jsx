import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

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

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data in localStorage (mock authentication)
      const userData = {
        id: Date.now(),
        name: formData?.fullName,
        email: formData?.email,
        role: 'Caregiver',
        createdAt: new Date()?.toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-error';
    if (passwordStrength <= 2) return 'bg-warning';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Field */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
          disabled={isLoading}
        />

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        {/* Password Field */}
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          
          {/* Password Strength Indicator */}
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength <= 2 ? 'text-error' : 
                  passwordStrength <= 3 ? 'text-warning' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Password requirements:</p>
                <ul className="space-y-1 ml-4">
                  <li className={`flex items-center space-x-1 ${formData?.password?.length >= 8 ? 'text-success' : 'text-muted-foreground'}`}>
                    <Icon name={formData?.password?.length >= 8 ? "Check" : "X"} size={12} />
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center space-x-1 ${/[A-Z]/?.test(formData?.password) ? 'text-success' : 'text-muted-foreground'}`}>
                    <Icon name={/[A-Z]/?.test(formData?.password) ? "Check" : "X"} size={12} />
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center space-x-1 ${/[0-9]/?.test(formData?.password) ? 'text-success' : 'text-muted-foreground'}`}>
                    <Icon name={/[0-9]/?.test(formData?.password) ? "Check" : "X"} size={12} />
                    <span>One number</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />

        {/* Terms and Conditions Checkbox */}
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          name="agreeToTerms"
          checked={formData?.agreeToTerms}
          onChange={handleInputChange}
          error={errors?.agreeToTerms}
          required
          disabled={isLoading}
        />

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors?.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="UserPlus"
          iconPosition="left"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;