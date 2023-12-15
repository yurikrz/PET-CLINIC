export const extractValidationData = (resultValidation) => {
  let errorMessage;
  let data;
  const hasError = !resultValidation.success;

  if (hasError) errorMessage = JSON.parse(resultValidation.error.message);
  else data = resultValidation.data;

  return {
    hasError,
    errorMessage,
    data,
  };
};
