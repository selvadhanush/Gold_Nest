import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;