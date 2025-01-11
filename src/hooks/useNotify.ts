import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function useNotify() {
  function error(message: string) {
    toast.error(message, {
      className: 'custom-toast',
    });
  }

  function warning(message: string) {
    toast.warn(message, {
      className: 'custom-toast',
    });
  }

  function success(message: string, timeout?: number) {
    toast.success(message, {
      autoClose: timeout,
      className: 'custom-toast',
    });
  }

  return { error, warning, success };
}

// Add custom styles for the toast notifications
// const styles = `
// .custom-toast {
//   margin-top: 40px;
//    width: 80%;
//   margin: auto;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1);
//   background-color:#fff;
//   color:#346D4D;
// }
// `;

