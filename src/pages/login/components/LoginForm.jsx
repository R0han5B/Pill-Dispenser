import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

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

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Mock authentication - check for demo credentials
    if (formData?.email === 'demo@smartpill.com' && formData?.password === 'demo123') {
      onLogin(formData);
      navigate('/dashboard');
    } else if (formData?.email === 'caregiver@example.com' && formData?.password === 'care123') {
      onLogin(formData);
      navigate('/dashboard');
    } else {
      setErrors({
        general: 'Invalid credentials. Try demo@smartpill.com / demo123 or caregiver@example.com / care123'
      });
    }
  };

  const handleDemoLogin = () => {
    const demoData = {
      email: 'demo@smartpill.com',
      password: 'demo123'
    };
    setFormData(demoData);
    onLogin(demoData);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors?.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{errors?.general}</p>
          </div>
        </div>
      )}
      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      {/* Password Input */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isLoading}
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
        </button>
      </div>
      {/* Sign In Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="h-12"
      >
        Sign In
      </Button>
      {/* Demo Account Button */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="h-12"
        iconName="Play"
        iconPosition="left"
      >
        Try Demo Account
      </Button>
      {/* Additional Links */}
      <div className="space-y-4 text-center">
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          onClick={() => navigate('/forgot-password')}
          disabled={isLoading}
        >
          Forgot your password?
        </button>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;