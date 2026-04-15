module.exports = function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    for (const rule of rules) {
      const value = req[rule.source]?.[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push({ field: rule.field, message: rule.message || `${rule.field} is required` });
        continue;
      }

      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (rule.type === "int") {
        const parsed = Number(value);

        if (!Number.isInteger(parsed)) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be an integer` });
          continue;
        }

        if (rule.min !== undefined && parsed < rule.min) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at least ${rule.min}` });
          continue;
        }

        if (rule.max !== undefined && parsed > rule.max) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at most ${rule.max}` });
          continue;
        }

        req[rule.source][rule.field] = parsed;
        continue;
      }

      if (rule.type === "string") {
        const text = String(value).trim();

        if (rule.minLength !== undefined && text.length < rule.minLength) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at least ${rule.minLength} characters` });
          continue;
        }

        if (rule.maxLength !== undefined && text.length > rule.maxLength) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters` });
          continue;
        }

        if (rule.enum && !rule.enum.includes(text)) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be one of: ${rule.enum.join(", ")}` });
          continue;
        }

        req[rule.source][rule.field] = text;
        continue;
      }

      if (rule.type === "email") {
        const text = String(value).trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(text)) {
          errors.push({ field: rule.field, message: rule.message || `${rule.field} must be a valid email` });
          continue;
        }

        req[rule.source][rule.field] = text.toLowerCase();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    next();
  };
};