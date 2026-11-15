import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { KeyRound, RotateCw, ArrowLeft, Mail, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const emailParam = searchParams.get('email') || location.state?.email || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    const currentEmail = searchParams.get('email') || location.state?.email || '';
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [searchParams, location.state]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const submitOtpCode = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');

    if (!email.trim()) {
      toast.error('Email address is missing.');
      return;
    }

    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: code,
      });

      if (res.data?.success) {
        setVerifiedSuccess(true);
        if (!shouldReduceMotion) {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981'],
          });
        }
        toast.success(res.data.message || '🎉 Account verified successfully! Please log in to continue.');
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Account verified! Please log in with your credentials.',
              email: email.trim(),
            },
            replace: true,
          });
        }, 700);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please check the code.';
      toast.error(msg);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 0) {
      newOtp[index] = cleaned[cleaned.length - 1];
      setOtp(newOtp);

      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Auto-submit immediately when all 6 digits are typed
        const fullCode = newOtp.join('');
        if (fullCode.length === 6) {
          submitOtpCode(fullCode);
        }
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submitOtpCode();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      const targetIndex = Math.min(digits.length, 5);
      inputRefs.current[targetIndex]?.focus();

      // If full 6-digit code was pasted, trigger instant auto-verify
      if (digits.length === 6) {
        submitOtpCode(digits);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    if (!email.trim()) {
      toast.error('Please enter your email to resend code.');
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', {
        email: email.trim().toLowerCase(),
      });

      if (res.data?.success) {
        toast.success('A fresh 6-digit passcode has been sent to your email.');
        setCountdown(45);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend passcode.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

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
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-cyanGlow animate-float"
          >
            {verifiedSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <KeyRound className="w-7 h-7" />
            )}
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {verifiedSuccess ? 'Account Verified!' : 'Verify Security Code'}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {verifiedSuccess
              ? 'Redirecting to Login...'
              : 'Enter the 6-digit passcode dispatched to your email:'}
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>{email || 'your email'}</span>
          </motion.div>
        </div>

        <Card className="p-6 sm:p-8 hologram-border backdrop-blur-xl">
          <form onSubmit={(e) => { e.preventDefault(); submitOtpCode(); }} className="space-y-6">
            
            {!emailParam && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                  Confirm Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full text-sm rounded-xl py-2 px-3 border border-white/10 bg-[#12111E] text-white outline-none focus:border-brand-500 font-mono transition-all"
                />
              </div>
            )}

            {/* 6-box OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
                  Enter 6-Digit Passcode
                </label>
                <span className="text-[11px] text-cyan-400 font-mono inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-submits on 6th digit
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    whileFocus={{ scale: 1.1, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    aria-label={`Digit ${index + 1}`}
                    disabled={loading || verifiedSuccess}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold font-mono rounded-xl outline-none transition-all duration-200
                      ${
                        digit
                          ? 'border-2 border-cyan-400 bg-cyan-500/15 text-white shadow-cyanGlow'
                          : 'border border-white/10 bg-[#12111E] text-white hover:border-white/25'
                      }
                      focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40
                    `}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
              <span>Expires in: <strong className="text-cyan-400">10m</strong></span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Single-use
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={verifiedSuccess}
              className="w-full shadow-neon animate-shimmer"
            >
              {verifiedSuccess ? 'Redirecting to Login...' : 'Verify Passcode & Proceed to Login'}
            </Button>

            {/* Resend Cooldown */}
            <div className="pt-2 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend New Passcode</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
                  <span>Resend code available in <strong>{countdown}s</strong></span>
                </div>
              )}
            </div>

          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Signup
            </Link>
          </div>
        </Card>

      </motion.div>
    </div>
  );
};

export default VerifyOtp;
