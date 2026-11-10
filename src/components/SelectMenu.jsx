import React, { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

function SelectMenu({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  ariaLabel,
  disabled = false,
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    const closeMenu = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const selectOption = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between gap-3 border border-stone-300 bg-white text-left text-stone-700 shadow-sm transition-colors hover:border-deepblue-300 focus:outline-none focus:ring-2 focus:ring-deepblue-400 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'min-w-44 rounded-lg px-3 py-1.5 text-sm' : 'rounded-xl px-4 py-3'}`}
      >
        <span className={`truncate ${selectedOption ? '' : 'text-stone-500'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <FiChevronDown className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'bg-deepblue-500 text-white' : 'text-stone-700 hover:bg-stone-100'}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <FiCheck className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SelectMenu;