import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  icon: Icon
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-yellow-600 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;