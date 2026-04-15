const validateRequest = require("./validateRequest");

exports.productIdParamValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Product id must be a positive integer" },
]);

exports.reviewValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Product id must be a positive integer" },
  { source: "body", field: "userId", required: true, type: "int", min: 1, message: "userId must be a positive integer" },
  { source: "body", field: "review", required: true, type: "string", minLength: 1, maxLength: 1000 },
  { source: "body", field: "rating", required: true, type: "int", min: 1, max: 5, message: "rating must be between 1 and 5" },
]);