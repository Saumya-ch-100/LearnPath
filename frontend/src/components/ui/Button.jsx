const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
    success: 'bg-success hover:bg-success-600 text-white shadow-md',
    teal: 'bg-teal hover:bg-teal-600 text-white shadow-md hover:shadow-lg',
    purple: 'bg-purple hover:bg-purple-600 text-white shadow-md hover:shadow-lg',
    orange: 'bg-orange hover:bg-orange-600 text-white shadow-md hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-base rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
