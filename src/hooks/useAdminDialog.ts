import { useState, useCallback } from 'react';
import type { DialogVariant, ConfirmDialogProps } from '@/components/admin/ConfirmDialog';

type DialogState = Omit<ConfirmDialogProps, 'open'>;

export function useAdminDialog() {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const close = useCallback(() => {
    setDialog(null);
    setDialogLoading(false);
  }, []);

  const showConfirm = useCallback(
    (options: {
      title: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
      variant?: DialogVariant;
      onConfirm: () => void | Promise<void>;
    }) => {
      setDialog({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        variant: options.variant ?? 'danger',
        onConfirm: async () => {
          setDialogLoading(true);
          try {
            await options.onConfirm();
          } finally {
            setDialogLoading(false);
            setDialog(null);
          }
        },
        onCancel: close,
      });
    },
    [close]
  );

  const showAlert = useCallback(
    (title: string, message: string, variant: DialogVariant = 'warning') => {
      setDialog({
        title,
        message,
        variant,
        confirmLabel: 'OK',
        onConfirm: close,
      });
    },
    [close]
  );

  const dialogProps: ConfirmDialogProps = {
    open: dialog !== null,
    title: dialog?.title ?? '',
    message: dialog?.message ?? '',
    confirmLabel: dialog?.confirmLabel,
    cancelLabel: dialog?.cancelLabel,
    variant: dialog?.variant,
    loading: dialogLoading,
    onConfirm: dialog?.onConfirm ?? close,
    onCancel: dialog?.onCancel,
  };

  return { dialogProps, showConfirm, showAlert };
}
