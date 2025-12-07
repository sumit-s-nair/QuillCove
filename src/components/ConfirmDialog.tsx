import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    warning: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    info: 'from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-slide-in">
        {/* Icon and Title */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`p-3 rounded-full ${
            variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' :
            variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-teal-100 dark:bg-teal-900/30'
          }`}>
            <AlertTriangle 
              size={24} 
              className={
                variant === 'danger' ? 'text-red-600 dark:text-red-400' :
                variant === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-teal-600 dark:text-teal-400'
              }
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${variantStyles[variant]} text-white rounded-lg transition-all font-medium shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
