import http from "../http-common";

// class that handles the calling of different api service
// Register user
const register = async (userData) => {
  const response = await http.post("/accounts/register", userData);
  return response.data;
};

// Login user
const login = async (email, password) => {
  const userData = { email, password };
  const response = await http.post("/accounts/login", userData);

  return response.data;
};

// Verify 2FA
const verify2FA = async (email, token) => {
  const userData = { email, token };
  const response = await http.post("/accounts/verify2FA", userData);

  return response.data;
};
const authService = {
  register,
  login,
  verify2FA
};

export default authService;
