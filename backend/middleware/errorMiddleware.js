const notFound = (req, res, next) => {
  const err = new Error(`Not found -${req.originalUrl}`);
  res.status(400);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
