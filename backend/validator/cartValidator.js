const validateRequest = require("./validateRequest");

exports.addToCartValidator = validateRequest([
  { source: "body", field: "userId", required: true, type: "int", min: 1, message: "userId must be a positive integer" },
  { source: "body", field: "productId", required: true, type: "int", min: 1, message: "productId must be a positive integer" },
  { source: "body", field: "quantity", required: false, type: "int", min: 1, message: "quantity must be a positive integer" },
]);

exports.userIdParamValidator = validateRequest([
  { source: "params", field: "userId", required: true, type: "int", min: 1, message: "userId must be a positive integer" },
]);