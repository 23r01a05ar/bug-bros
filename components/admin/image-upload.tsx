'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  bucket: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  bucket,
  currentUrl,
  onUpload,
  folder = '',
  accept = 'image/*',
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-fg)] dark:text-[var(--color-dark-fg)]">
        {label}
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-[var(--color-error)] text-white rounded-full shadow-md hover:opacity-80 transition-opacity"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          type="button"
          className="flex flex-col items-center justify-center gap-2 w-32 h-32 border-2 border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors cursor-pointer"
        >
          {uploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
          ) : (
            <>
              <Upload size={20} className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]" />
              <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                Upload
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}

interface FileUploadProps {
  bucket: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function FileUpload({
  bucket,
  currentUrl,
  onUpload,
  folder = '',
  accept = '.pdf,.doc,.docx',
  label = 'Upload File',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    currentUrl ? currentUrl.split('/').pop() || null : null
  );
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      setFileName(file.name);
      onUpload(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-fg)] dark:text-[var(--color-dark-fg)]">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded hover:border-[var(--color-accent)] transition-colors"
        >
          {uploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
          ) : (
            <Upload size={16} />
          )}
          {fileName || 'Choose file'}
        </button>
        {fileName && (
          <button
            onClick={() => { setFileName(null); onUpload(''); }}
            type="button"
            className="text-[var(--color-error)] hover:opacity-70"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
