import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 shadow-sm',
    md: 'text-sm px-5 py-2.5 gap-2 shadow',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-purple hover:from-brand-500 hover:to-brand-400 text-white shadow-neon hover:shadow-hover focus:ring-brand-500 border border-brand-400/30',
    secondary:
      'bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-white shadow-cyanGlow focus:ring-cyan-500 border border-cyan-400/30',
    outline:
      'bg-transparent hover:bg-brand-500/10 text-brand-300 border border-brand-500/40 hover:border-brand-400 focus:ring-brand-500',
    ghost:
      'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-transparent focus:ring-brand-500',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
