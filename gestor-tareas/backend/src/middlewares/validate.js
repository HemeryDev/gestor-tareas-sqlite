const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      next(new ApiError(400, `Error de validación: ${errorMessages}`));
    } else {
      next(new ApiError(400, `Error de validación: ${error.message}`));
    }
  }
};

module.exports = validate;
