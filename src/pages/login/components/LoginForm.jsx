import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabaseClient';

const LoginForm = ({ onLogin, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      if (error) throw error;

      // data.session.user is the logged-in user
      const user = data?.user || data?.session?.user;
      if (!user) throw new Error('No user session returned');

      // Set user metadata if not already set
      const userMetadata = user.user_metadata || {};
      if (!userMetadata.name) {
        await supabase.auth.updateUser({
          data: {
            name: formData.email.split('@')[0], // Use email prefix as default name
            role: 'Caregiver'
          }
        });
      }

      // Call parent callback to store UI info and redirect
      onLogin?.(user);

      // navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        disabled={loading || isLoading}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          disabled={loading || isLoading}
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading || isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>

      <Button type="submit" variant="default" fullWidth loading={loading || isLoading} disabled={loading || isLoading} className="h-12" iconName="LogIn" iconPosition="left">
        {loading || isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      <div className="space-y-4 text-center">
        <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors" onClick={() => navigate('/forgot-password')} disabled={loading || isLoading}>
          Forgot your password?
        </button>

        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>Don't have an account?</span>
          <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors" onClick={() => navigate('/register')} disabled={loading || isLoading}>
            Create Account
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;