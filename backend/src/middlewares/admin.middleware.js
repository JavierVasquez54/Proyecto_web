const isAdmin = (req, res, next) => {
    // Check if the user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // If the user is an admin, proceed to the next middleware or controller
    next();
  };
  
  module.exports = isAdmin;