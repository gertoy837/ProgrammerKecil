const validateRequest = require("./validateRequest");

exports.categoryIdParamValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Category id must be a positive integer" },
]);

exports.createCategoryValidator = validateRequest([
  { source: "body", field: "name", required: true, type: "string", minLength: 1, maxLength: 100 },
]);

exports.updateCategoryValidator = validateRequest([
  { source: "params", field: "id", required: true, type: "int", min: 1, message: "Category id must be a positive integer" },
  { source: "body", field: "name", required: true, type: "string", minLength: 1, maxLength: 100 },
]);
