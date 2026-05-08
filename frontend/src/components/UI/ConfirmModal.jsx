import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) => {
  const variants = {
    danger: 'btn-primary bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    primary: 'btn-primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          "p-4 rounded-full mb-4",
          variant === 'danger' ? "bg-rose-50 text-rose-600" : "bg-primary-50 text-primary-600"
        )}>
          <AlertTriangle size={32} />
        </div>
        <p className="text-slate-600 mb-8">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} className={cn("btn flex-1", variants[variant])}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Local cn import for convenience
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default ConfirmModal;
