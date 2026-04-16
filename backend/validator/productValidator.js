const validateRequest = require("./validateRequest");

exports.productIdParamValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Product id must be a positive integer" },
]);

exports.createProductValidator = validateRequest([
  { source: "body", field: "name", required: true, type: "string", minLength: 1, maxLength: 200 },
  { source: "body", field: "description", required: true, type: "string", minLength: 1, maxLength: 1000 },
  { source: "body", field: "price", required: true, type: "int", min: 1, message: "price must be a positive integer" },
  { source: "body", field: "categoryId", required: true, type: "int", min: 1, message: "categoryId must be a positive integer" },
  { source: "body", field: "stock", required: true, type: "int", min: 0, message: "stock must be a non-negative integer" },
]);

exports.updateProductValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Product id must be a positive integer" },
  { source: "body", field: "name", required: false, type: "string", minLength: 1, maxLength: 200 },
  { source: "body", field: "description", required: false, type: "string", minLength: 1, maxLength: 1000 },
  { source: "body", field: "price", required: false, type: "int", min: 1, message: "price must be a positive integer" },
  { source: "body", field: "categoryId", required: false, type: "int", min: 1, message: "categoryId must be a positive integer" },
  { source: "body", field: "stock", required: false, type: "int", min: 0, message: "stock must be a non-negative integer" },
]);

exports.reviewValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Product id must be a positive integer" },
  { source: "body", field: "userId", required: true, type: "int", min: 1, message: "userId must be a positive integer" },
  { source: "body", field: "review", required: true, type: "string", minLength: 1, maxLength: 1000 },
  { source: "body", field: "rating", required: true, type: "int", min: 1, max: 5, message: "rating must be between 1 and 5" },
]);