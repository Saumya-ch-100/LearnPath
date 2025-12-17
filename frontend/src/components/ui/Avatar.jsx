const Avatar = ({ 
  src, 
  alt = 'User', 
  initials = 'U',
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div 
      className={`${sizes[size]} rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center font-bold text-white shadow-md ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-xl object-cover" />
      ) : (
        <span className="uppercase">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
