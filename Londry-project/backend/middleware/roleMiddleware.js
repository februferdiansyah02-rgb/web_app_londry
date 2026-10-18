/**
 * Middleware pembatas akses berdasarkan role pengguna.
 * Contoh penggunaan: authorizeRoles('admin', 'outlet')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak untuk role Anda",
      });
    }
    next();
  };
};
