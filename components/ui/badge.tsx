import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'hackathon' | 'ctf' | 'other';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

export function getAchievementBadgeVariant(type: string): 'hackathon' | 'ctf' | 'other' {
  switch (type) {
    case 'hackathon':
      return 'hackathon';
    case 'ctf':
      return 'ctf';
    default:
      return 'other';
  }
}
