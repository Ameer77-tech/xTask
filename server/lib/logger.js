const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const time = Date.now() - start;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${time}ms`
    );
  });

  next();
};

export default logger;