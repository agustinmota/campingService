function authorizedRoles(...roles) {
  return (req, res, next) => {

    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = authorizedRoles;
