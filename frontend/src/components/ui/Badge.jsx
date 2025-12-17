const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    teal: 'bg-teal/10 text-teal-700 border border-teal/20',
    purple: 'bg-purple/10 text-purple-700 border border-purple/20',
    orange: 'bg-orange/10 text-orange-700 border border-orange/20',
    success: 'bg-success/10 text-success-700 border border-success/20',
    warning: 'bg-warning/10 text-warning-700 border border-warning/20',
    danger: 'bg-danger/10 text-danger-700 border border-danger/20',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
