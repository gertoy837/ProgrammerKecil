const validateRequest = require("./validateRequest");

exports.registerValidator = validateRequest([
  { source: "body", field: "name", required: true, type: "string", minLength: 2, maxLength: 100 },
  { source: "body", field: "email", required: true, type: "email" },
  { source: "body", field: "password", required: true, type: "string", minLength: 6, maxLength: 100 },
  { source: "body", field: "role", required: false, type: "string", enum: ["user", "admin"] },
]);

exports.loginValidator = validateRequest([
  { source: "body", field: "email", required: true, type: "email" },
  { source: "body", field: "password", required: true, type: "string", minLength: 6, maxLength: 100 },
]);

exports.updateProfileValidator = [
  validateRequest([
    { source: "body", field: "name", required: false, type: "string", minLength: 2, maxLength: 100 },
    { source: "body", field: "email", required: false, type: "email" },
  ]),
  (req, res, next) => {
    const hasName = typeof req.body.name === "string" && req.body.name.trim() !== "";
    const hasEmail = typeof req.body.email === "string" && req.body.email.trim() !== "";

    if (!hasName && !hasEmail) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [{ field: "body", message: "At least one of name or email is required" }],
      });
    }

    next();
  },
];