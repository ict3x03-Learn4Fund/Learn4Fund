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
const verify2FA = async (userData) => {
  // Making calls to server side
  return await http.post("/accounts/verify2FA", userData);
};

// Get Account
const getAccount = async (userId) => {
  // Making calls to server side
  return await http.get(`/accounts/getAccount/${userId}`);

};

// Reset password
const resetPass = async (request) => {
  // Making calls to server side
  return await http.post(`/accounts/reset`, request);
};

// Verify reset
const verifyReset = async (id, jwt) => {
  return await http.get(`/accounts/reset/${id}/${jwt}`);
}

// change password after reset
const changePass = async (id, jwt, password) => {
  return await http.post(`/accounts/reset/${id}/${jwt}`, { password: password });
}

// normal password change
const normalChangePass = async (userId, password) => {
  const request = { userId, password }
  return await http.post(`/accounts/changePass/${userId}`, request)
}

// upload new avatar img
const uploadAvatar = async (userId, imgId) => {
  const request = { userId, imgId }
  return await http.post(`/accounts/uploadAvatar/${userId}`, request);
}

// update new details
const updateDetails = async (userId, firstName, lastName, email) => {
  const request = { userId, firstName, lastName, email }
  return await http.post(`/accounts/update/${userId}`, request);
}

// update email Subscription
const updateSubscription = async (userId, emailSubscription) => {
  const request = { userId, emailSubscription }
  return await http.post(`/accounts/updateSubscription/${userId}`, request);
}

// delete account
const deleteAcc = async (userId) => {
  return await http.post(`/accounts/delete/${userId}`)
}


// Client side functions
const authService = {
  register,
  login,
  verify2FA,
  getAccount,
  resetPass,
  verifyReset,
  changePass,
  uploadAvatar,
  normalChangePass,
  updateDetails,
  deleteAcc,
  updateSubscription,
};

export default authService;
