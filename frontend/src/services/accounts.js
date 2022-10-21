import http from "../http-common";

// class that handles the calling of different api service
// Register user
const register = async (userData) => {
  // Making calls to server side
  const response = await http.post("/accounts/register", userData);
  return response.data;
};

// Login user
const login = async (email, password) => {
  const userData = { email, password };
  // Making calls to server side
  const response = await http.post("/accounts/login", userData);
  return response.data;
};

// Verify 2FA
const verify2FA = async (email, token) => {
  const userData = { email, token };
  // Making calls to server side
  const response = await http.post("/accounts/verify2FA", userData);

  return response.data;
};

// Get Account
const getAccount = async () => {
  // Making calls to server side
const response = await http.get(`/accounts/getAccount`)

  return response.data;
};

// Client side functions
const authService = {
  register,
  login,
  verify2FA,
  getAccount,
};

export default authService;
