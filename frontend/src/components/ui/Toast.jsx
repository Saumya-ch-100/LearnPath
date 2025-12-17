import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
  };

  const icons = {
    success: <CheckCircle2 size={20} strokeWidth={2.5} />,
    error: <AlertCircle size={20} strokeWidth={2.5} />,
    info: <Info size={20} strokeWidth={2.5} />,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${styles[type]} px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-up`}
    >
      {icons[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-75 transition-opacity">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Toast;
