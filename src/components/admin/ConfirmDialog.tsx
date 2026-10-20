'use client';

import { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export type DialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : variant === 'warning'
        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
        : 'bg-black hover:bg-gray-900 text-white';

  const iconColor =
    variant === 'danger'
      ? 'text-red-500'
      : variant === 'warning'
        ? 'text-yellow-500'
        : 'text-blue-500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl mx-4">
        {/* Close button (only when cancel is available) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
              {variant === 'info' ? (
                <Info className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 id="dialog-title" className="text-base font-semibold text-gray-900">
                {title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors ${confirmBtnClass}`}
            >
              {loading ? 'Please wait…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
