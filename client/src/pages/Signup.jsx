import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Zap, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Compute password strength score (0-4)
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 10) score++;
    if (pass.length >= 15) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const strengthLabels = ['Too weak', 'Basic', 'Good', 'Strong', 'Hardened'];
  const strengthColors = [
    'bg-gray-700',
    'bg-red-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-emerald-500',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters long';
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name must contain letters and spaces only';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 15) {
      newErrors.password = 'Password must be at least 15 characters long';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{15,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must include uppercase, lowercase, numbers, and a special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Verification code sent to your email!');
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
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
            <Zap className="w-7 h-7" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign up to register your team for the MatruCare AI Hackathon 2026.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-mono text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant OTP verification & auto-login</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 hologram-border backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="e.g. Aryan Mehra"
              icon={User}
              required
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              autoComplete="name"
            />

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
              helperText="A 6-digit one-time passcode will be sent here."
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 15 chars (e.g. Passphrase#2026!)"
              icon={Lock}
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Must be at least 15 characters with letters, numbers, and symbols."
              autoComplete="new-password"
            />

            {/* Password Strength Meter */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5 pt-1"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Security Strength:</span>
                  <span className="font-mono font-semibold text-gray-200">
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <motion.div
                      key={step}
                      layout
                      className={`h-full rounded-full transition-colors duration-300 ${
                        strength >= step ? strengthColors[strength] : 'bg-gray-800'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              icon={Lock}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-neon animate-shimmer"
              >
                Send Verification Passcode
              </Button>
            </div>

          </form>

          {/* Footer note */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-300 hover:text-white transition-colors">
              Log in to dashboard
            </Link>
          </div>
        </Card>

      </motion.div>
    </div>
  );
};

export default Signup;
