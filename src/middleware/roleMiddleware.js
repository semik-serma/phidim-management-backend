export const requireAdmin = (req, res, next) => {
  const role = req.auth?.sessionClaims?.metadata?.role;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};