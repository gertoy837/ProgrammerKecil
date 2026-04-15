const { verifyAccessToken } = require("../lib/authToken");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");
  const accessToken = scheme === "Bearer" ? token : req.headers["x-access-token"];
  const user = verifyAccessToken(accessToken);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};