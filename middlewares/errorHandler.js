module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server." : message,
  });
};
