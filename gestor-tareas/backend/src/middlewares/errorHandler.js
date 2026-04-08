const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Si es un error de formato JSON de express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: "JSON mal formado",
    });
  }

  console.error("Internal Server Error:", err);
  
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
};

module.exports = errorHandler;
