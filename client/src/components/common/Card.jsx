import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`rounded-2xl transition-all duration-300 border
        ${
          glass
            ? 'glass-card'
            : 'bg-[#12111E] border-white/10'
        }
        ${hoverEffect ? 'hover:border-brand-500/50 hover:shadow-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
