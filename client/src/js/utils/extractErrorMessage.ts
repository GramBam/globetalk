export const extractErrorMessage = (error: any) => {
  return error.response?.data?.message || error.message || error.toString();
};
