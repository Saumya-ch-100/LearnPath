const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 ${hover ? 'hover:shadow-xl hover:border-primary/20 transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
