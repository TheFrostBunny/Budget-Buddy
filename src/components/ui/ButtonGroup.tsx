import React from 'react';

interface ButtonGroupProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ButtonGroup<T extends string>({ options, value, onChange, className = '' }: ButtonGroupProps<T>) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`px-2 py-1 rounded text-xs border ${value === opt.value ? 'bg-primary text-white' : 'bg-card'}`}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
