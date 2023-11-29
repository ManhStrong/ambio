import createError from "http-errors";
export const BadRequestException = (err, errorCode, res) => {
  console.log(9999);
  const error = createError.BadRequest(err);
  return res.status(error.status).json({
    errCode: errorCode,
    message: error.message,
  });
};
export const InteralServerErrorException = (req, errorCode, res) => {
  const error = createError.InternalServerError();
  return res.status(error.status).json({
    errorCode: errorCode,
    message: error.message,
  });
};

export const NotFoundException = (err, errorCode, res) => {
  const error = createError.NotFound(err);
  return res.status(error.status).json({
    errorCode: errorCode,
    message: error.message,
  });
};
export const UnauthorizedException = (err, errorCode, res) => {
  const error = createError.Unauthorized(err);
  return res.status(error.status).json({
    errorCode: errorCode,
    message: error.message,
  });
};
