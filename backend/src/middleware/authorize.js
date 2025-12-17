// Middleware to authorize users based on their role
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required. Please log in.' 
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: This action requires ${allowedRoles.join(' or ')} role.`,
        requiredRole: allowedRoles,
        currentRole: req.user.role
      });
    }

    // User is authorized, proceed to next middleware
    next();
  };
};

// Helper middleware for admin-only routes
export const adminOnly = authorize('admin');

// Helper middleware for mentor and admin routes
export const mentorOrAdmin = authorize('mentor', 'admin');

// Helper middleware for all authenticated users
export const authenticatedOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required. Please log in.' 
    });
  }
  next();
};
