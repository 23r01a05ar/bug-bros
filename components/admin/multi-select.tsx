'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  avatar?: string | null;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(o.value)
  );

  const selectedOptions = options.filter((o) => selected.includes(o.value));

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-fg)] dark:text-[var(--color-dark-fg)]">
          {label}
        </label>
      )}

      {/* Selected chips */}
      <div
        className="input-field cursor-pointer flex flex-wrap gap-1.5 min-h-[44px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] text-sm">
            {placeholder}
          </span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--color-accent-light)] dark:bg-[var(--color-dark-accent-light)] text-[var(--color-accent)] text-xs rounded-full"
            >
              {opt.label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(opt.value);
                }}
                type="button"
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
        <ChevronDown
          size={16}
          className={`ml-auto self-center text-[var(--color-muted)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-50 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
            <div className="p-2 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm bg-transparent outline-none"
                autoFocus
              />
            </div>
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-center text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                No options available
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    toggle(opt.value);
                    setSearch('');
                  }}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--color-surface-raised)] dark:hover:bg-[var(--color-dark-surface-raised)] transition-colors"
                >
                  {opt.avatar && (
                    <img
                      src={opt.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
