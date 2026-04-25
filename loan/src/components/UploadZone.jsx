import React, { useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

export default function UploadZone({ onUpload, isUploading, error }) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files?.length) {
        onUpload(files[0]);
      }
    },
    [onUpload]
  );

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
        error ? 'border-red-400 bg-red-50/10' : 'border-[var(--border-medium)] hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-card)] opacity-50 pointer-events-none rounded-2xl" />
      <UploadCloud className="mb-4 h-10 w-10 text-[var(--accent)]" />
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {isUploading ? 'Analyzing document...' : 'Drag & drop your bank statement'}
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">Supports PDF and CSV (last 6 months)</p>
      
      <div className="mt-4 flex items-center gap-4">
        <label className="relative cursor-pointer rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
          Browse Files
          <input
            type="file"
            className="absolute hidden"
            accept=".pdf,.csv"
            onChange={(e) => {
              if (e.target.files?.length) onUpload(e.target.files[0]);
            }}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {error && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-500">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
