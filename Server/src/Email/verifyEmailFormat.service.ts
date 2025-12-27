export const verifyEmailFormat = (email: string): boolean => {
  const regex = new RegExp("[a-z0-9._-]+@[a-z0-9]+.[a-z]{2,3}", "i");

  return regex.test(email);
};
