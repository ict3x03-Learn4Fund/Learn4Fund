import { Navigate, useNavigate } from "react-router-dom";
import http from "../http-common";

const getAllAccounts = async () => {                        // [Logging] Get all accounts
  // Making calls to server side, return response
  const res = await http.get("/admin/getAllAccounts");      // Route /v1/api/admin/getAllAccounts
  // console.log("account.js:" + res.status);
  return res;

}
// Get all logs [admin]
const getAllLogs = async () => {                            // [Logging] Get all logs
  // Making calls to server side, return response
  return await http.get("/admin/getAllLogs");               // Route /v1/api/admin/getAllLogs
}

const lockUnlockAccount = async (data) => {                 // [Management] Lock or unlock account
  // Making calls to server side, return response
  return await http.post("/admin/lockUnlockAccount", data); // Route /v1/api/admin/lockUnlockAccount
}

const deleteAccount = async (data) => {                     // [Management] Delete account
  // Making calls to server side, return response
  return await http.post("/admin/deleteAccount", data);   // Route /v1/api/admin/deleteAccount
}

// Client side functions
const adminAuthService = {      // [Service] Accessed by useAuth() in frontend /frontend/src/hooks/useAuth.jsx
  getAllAccounts,
  getAllLogs,
  lockUnlockAccount,
  deleteAccount,
};

export default adminAuthService;
