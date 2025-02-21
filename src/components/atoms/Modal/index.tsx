import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/utils/cn';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  contentClassName?: string;
  title?: string;
  showCloseIcon?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  width, 
  height, 
  contentClassName,
  title,
  showCloseIcon = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div
        className={cn(
          "relative bg-white overflow-y-auto animate-slide-in shadow-xl rounded-xl",
          "max-h-[90vh] max-w-[90vw]",
          `w-[${width}] h-[${height}]`,
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseIcon && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        )}

        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
        )}

        <div className={cn(
          "p-6",
          title ? "pt-4" : "pt-6"
        )}>
          {children}
        </div>
      </div>
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.2s ease-out forwards;
        }

        @keyframes slide-in {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;