import React from 'react';

export function SkeletonLine({ width = '100%', height = '16px' }: { width?: string; height?: string }) {
  return <div className="skeleton" style={{ width, height }} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)' }} />
      <div className="skeleton" style={{ width: '70%', height: '20px' }} />
      <div className="skeleton" style={{ width: '100%', height: '14px' }} />
      <div className="skeleton" style={{ width: '90%', height: '14px' }} />
      <div className="flex gap-2">
        <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '50px', height: '24px', borderRadius: 'var(--radius-full)' }} />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%' }}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton flex-1" style={{ height: '16px' }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton flex-1" style={{ height: '20px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}
