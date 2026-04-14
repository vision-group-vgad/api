const errorResponse = (statusCode, message) => {
  return {
    statusCode,
    message,
  };
};

export default errorResponse;
