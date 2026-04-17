'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagsInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ label, value, onChange, placeholder = 'Add tag...' }: TagsInputProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-fg)] dark:text-[var(--color-dark-fg)]">
          {label}
        </label>
      )}
      <div className="input-field flex flex-wrap gap-1.5 min-h-[44px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)] text-sm rounded"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              type="button"
              className="hover:text-[var(--color-error)] transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm"
        />
      </div>
      <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
        Press Enter to add
      </p>
    </div>
  );
}
