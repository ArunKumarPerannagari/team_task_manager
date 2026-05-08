import React from 'react';
import { getInitials } from '../../utils/formatters';
import { cn } from './LoadingSpinner';

const Avatar = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-slate-100', sizes[size], className)}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold bg-primary-100 text-primary-700 uppercase',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
