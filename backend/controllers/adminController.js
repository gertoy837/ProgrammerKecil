exports.getCurrentAdmin = (req, res) => {
  res.json({ user: req.user });
};