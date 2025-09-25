import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error = false,
  label,
  description,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'input-field',
          error && 'border-error-300 focus:ring-error-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  label,
  description,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'textarea-field',
          error && 'border-error-300 focus:ring-error-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Input, Textarea };