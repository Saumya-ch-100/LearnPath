const Input = ({ 
  label, 
  type = 'text', 
  error, 
  className = '',
  icon,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 ${icon ? 'pl-11' : ''} text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-danger font-medium flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
