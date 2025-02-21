import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: 'custom-toast',
  style: {
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default function useNotify() {
  function error(message: string, options?: ToastOptions) {
    toast.error(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FCA5A5',
      },
      ...options,
    });
  }

  function warning(message: string, options?: ToastOptions) {
    toast.warn(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#FFFBEB',
        color: '#92400E',
        border: '1px solid #FCD34D',
      },
      ...options,
    });
  }

  function success(message: string, options?: ToastOptions) {
    toast.success(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#F0FDF4',
        color: '#166534',
        border: '1px solid #86EFAC',
      },
      ...options,
    });
  }

  function info(message: string, options?: ToastOptions) {
    toast.info(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#EFF6FF',
        color: '#1E40AF',
        border: '1px solid #93C5FD',
      },
      ...options,
    });
  }

  return { error, warning, success, info };
}

