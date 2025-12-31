import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import { supabase } from '../../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If session exists, redirect to dashboard
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) navigate('/dashboard', { replace: true });
    };
    check();
  }, [navigate]);

  const handleLogin = async (userObject) => {
    // userObject is from supabase auth; store minimal UI data if needed
    try {
      setLoading(true);
      // store user in localStorage only for UI convenience (not auth), optional:
      if (userObject?.id) {
        localStorage.setItem('smartpill_user', JSON.stringify({
          id: userObject.id,
          email: userObject.email,
          user_metadata: userObject.user_metadata || userObject?.user_metadata || {}
        }));
      } else {
        // demo (if pressed) — keep minimal
        localStorage.setItem('smartpill_user', JSON.stringify(userObject));
      }
      // Navigation happens in LoginForm after successful login, but ensure redirect if not
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <LoginHeader />
          <LoginForm onLogin={handleLogin} isLoading={loading} />
        </div>
        <LoginFooter />
      </div>
    </div>
  );
};

export default Login;
