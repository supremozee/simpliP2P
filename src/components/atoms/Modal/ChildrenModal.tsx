import React from "react";
import { cn } from "@/utils/cn";
import { IoClose } from "react-icons/io5";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseIcon?: boolean;
}

const ChildrenModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseIcon = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[9999] flex "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "relative bg-white overflow-y-auto animate-slide-in shadow-xl rounded-xl w-full max-w-md mx-auto",
          "max-h-[90vh] max-w-[90vw]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseIcon && (
          <Button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </Button>
        )}

        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary">{title}</h2>
          </div>
        )}

        <div className="p-6">{children}</div>
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
    </div>
  );
};

export default ChildrenModal;
