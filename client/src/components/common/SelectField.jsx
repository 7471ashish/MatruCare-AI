import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronDown } from 'lucide-react';

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => {
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

      <div className="relative">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id || name}-error` : helperText ? `${id || name}-helper` : undefined}
          className={`w-full text-sm rounded-xl py-2.5 pl-3.5 pr-10 appearance-none transition-all duration-200 outline-none cursor-pointer
            bg-[#12111E] text-gray-100 border
            ${
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        >
          <option value="" disabled className="text-gray-500 bg-[#12111E]">
            {placeholder}
          </option>
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="text-gray-100 bg-[#12111E]">
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

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

      {helperText && !error && (
        <p id={`${id || name}-helper`} className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default SelectField;
