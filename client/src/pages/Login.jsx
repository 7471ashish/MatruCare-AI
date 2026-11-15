import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [unverifiedState, setUnverifiedState] = useState(null);

  React.useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setUnverifiedState(null);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (res.data?.success && res.data.data?.token) {
        toast.success(res.data.message || 'Welcome back to MatruCare AI!');
        login(res.data.data.token, res.data.data.user);

        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.data?.isUnverified) {
        const unverifiedEmail = err.response.data.data.email || formData.email;
        setUnverifiedState(unverifiedEmail);
        toast.error(err.response.data.message || 'Your account is not verified yet.');
      } else {
        const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-4 shadow-neon animate-float"
          >
            <LogIn className="w-7 h-7" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Participant Login
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your dashboard and hackathon registration details.
          </p>
        </div>

        {/* Unverified Alert Banner */}
        {unverifiedState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
              <div className="text-xs space-y-2">
                <p className="font-semibold text-amber-200">
                  Account Verification Pending
                </p>
                <p className="text-amber-300/80">
                  Your email has not been confirmed yet. Enter the 6-digit passcode to activate your account.
                </p>
                <Link
                  to={`/verify-otp?email=${encodeURIComponent(unverifiedState)}`}
                  className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-white underline transition-colors"
                >
                  Verify Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        <Card className="p-6 sm:p-8 hologram-border backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@university.edu"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-neon animate-shimmer"
              >
                Sign In to Dashboard
              </Button>
            </div>

          </form>

          {/* Footer note */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-brand-300 hover:text-white transition-colors">
              Register now (Auto-login enabled)
            </Link>
          </div>
        </Card>

      </motion.div>
    </div>
  );
};

export default Login;
