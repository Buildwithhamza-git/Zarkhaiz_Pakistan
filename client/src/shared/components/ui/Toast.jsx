import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

const Toast = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-[60] flex items-center gap-3 rounded-xl bg-green-600 px-4 py-3 text-white shadow-lg animate-in fade-in">
      <CheckCircle2 size={20} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
