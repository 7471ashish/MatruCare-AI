import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  readOnly = false,
  disabled = false,
  className = '',
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"
        >
          {label} {required && <span className="text-brand-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id || name}-error` : helperText ? `${id || name}-helper` : undefined}
          className={`w-full text-sm rounded-xl py-2.5 transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${isPasswordField ? 'pr-10' : 'pr-3.5'}
            ${
              readOnly
                ? 'bg-[#181726]/60 text-gray-400 cursor-not-allowed border border-white/5 font-mono text-xs'
                : 'bg-[#12111E] text-gray-100 border'
            }
            ${
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
            }
          `}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Inline Field Error */}
      {error && (
        <motion.p
          id={`${id || name}-error`}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p id={`${id || name}-helper`} className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
