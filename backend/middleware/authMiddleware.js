const { verifyAccessToken } = require("../lib/authToken");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization header missing",
      });
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token format",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Token not provided",
      });
    }

    const user = verifyAccessToken(token);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized access",
    });
  }
};