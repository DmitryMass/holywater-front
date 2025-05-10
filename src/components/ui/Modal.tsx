import { cn } from '@utils/styles';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnClickOutside?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
}: ModalProps) => {
  // Предотвращаем скролл на body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Обработка клика по фону
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnClickOutside) {
      onClose();
    }
  };

  // Классы размера модального окна
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div className={cn('modal-box', sizeClasses[size])}>
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold">{title}</h3>
          <button type="button" className="btn btn-circle btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="py-4">{children}</div>
        {footer && <div className="modal-action border-t pt-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
