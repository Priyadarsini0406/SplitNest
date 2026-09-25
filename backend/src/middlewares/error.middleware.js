const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID"
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(
    err.statusCode || 500
  ).json({
    success: false,
    message:
      err.message ||
      "Internal server error"
  });
};

module.exports = errorMiddleware;