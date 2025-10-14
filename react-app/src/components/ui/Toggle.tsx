import { useState, useEffect } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <label className="flex cursor-pointer items-center">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <div
          className={`block h-8 w-14 rounded-full transition ${
            isChecked
              ? 'bg-indigo-600'
              : 'bg-gray-300'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              isChecked ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-base text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
}

