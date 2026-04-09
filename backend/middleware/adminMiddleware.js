 module.exports = (req, res, next) => {

  const user = req.user; // nanti dari JWT

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied (Admin only)"
    });
  }

  next();
};