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