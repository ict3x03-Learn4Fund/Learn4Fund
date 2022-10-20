import { createContext, useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/accounts";
import adminAuthService from "../services/admin";
import toast from "react-hot-toast";
import axios from "axios";                // [Error] To intercept error codes from Response

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const navigate = useNavigate();

  const authRegister = async (userForm) => {
    setAuthMsg("");
    try {
      const verifyUser = await authService.register(userForm);
      console.log(verifyUser);
      setCurrentUser(verifyUser);
      // navigate("/login2FA"); <- CHANGE TO GO TO HOMEPAGE STRAIGHT RMB CHANGE BACK 
      navigate("/");
      setAuthed(true); //delete later!!
      return verifyUser;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  };

  const login = async (email, password) => {
    setAuthMsg("");
    try { 
      const verifyUser = await authService.login(email, password);
      console.log(verifyUser);
      setCurrentUser(verifyUser);setAuthed(true);
      // navigate("/login2FA"); <- CHANGE TO GO TO HOMEPAGE STRAIGHT RMB CHANGE BACK 
      navigate("/"); //delete later!!
      setAuthed(true); //delete later!!
      return verifyUser;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  };

  const verify2FA = async (token) => {
    try {
      const verifyUser = await authService.verify2FA(currentUser.email, token);
      setCurrentUser(verifyUser);
      setAuthed(true);
      console.log("2fa", currentUser);
      console.log("2fa", authed);
      navigate("/")
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
    }
  };

  const getAllAccounts = async () => {
    try {
      const response = await adminAuthService.getAllAccounts(); // [Logging] /services/admin.js
      axios.interceptors.response.use(response => {             // [Error] To intercept error codes from Response
        return response.data.message;                           // [Error] Return error message
      }, error => {
        if (error.response.status === 401) {
          navigate("/");
        }
        return error.response.data.message;
      });
      return response;                                          // [Logging] Got all accounts successfully

    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  }

  const getAllLogs = async () => {
    try {
      const response = await adminAuthService.getAllLogs(); // [Logging] /services/admin.js
      axios.interceptors.response.use(response => {         // [Error] To intercept error codes from Response
        return response.data.message;                       // [Error] Return error message
      }, error => {
        navigate("/");
        return error.response.data.message;
      });
      return response;                                      // [Logging] Got all the logs successfully
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  }

  const lockUnlockAccount = async (data) => {
    try {
      const response = await adminAuthService.lockUnlockAccount(data);  // [Management] /services/admin.js
      console.log(response);
      axios.interceptors.response.use(response => {                     // [Error] To intercept error codes from Response
        return response.data.message;                                   // [Error] Return error message
      }, error => {
        navigate("/");
        return error.response.data.message;
      });
      return response;                                                  // [Management] Lock/Unlock account successfully
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  }

  const deleteAccount = async (data) => {
    try {
      const response = await adminAuthService.deleteAccount(data);  // [Management] /services/admin.js
      console.log(response);
      axios.interceptors.response.use(response => {                 // [Error] To intercept error codes from Response
        return response.data.message;                               // [Error] Return error message
      }, error => {
        navigate("/");
        return error.response.data.message;
      });
      return response;                                              // [Management] Account deleted successfully
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAuthMsg(message);
      toast.error(message);
      return message;
    }
  }

  const logout = () => {
    setCurrentUser(null);
    setAuthed(false);
    setAuthMsg("");
  };

  return (
    <AuthContext.Provider
      value={{
        authed,
        currentUser,
        login,
        logout,
        authMsg,
        verify2FA,
        authRegister,
        getAllAccounts,           // [Logging] To get all accounts
        getAllLogs,               // [Logging] To get all logs
        lockUnlockAccount,        // [Management] To lock/unlock account
        deleteAccount,            // [Management] To delete account
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function RequireAuth({ children }) {                               // [Authorization] To check if user is logged in
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children                                                              // [Authorization] If user is logged in, return children pages allowed (from App.jsx)
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />  // [Authorization] Redirect to login page if not
  );

}
export function RequireAdmin({ children }) {                              // [Authorization] To check if Admin is logged in
  const { authed, currentUser } = useAuth();
  console.log("RequireAdmin:  ", currentUser);
  if (authed === true && currentUser.role === "admin") {                  // [Authorization] If user is logged in and is admin, return children pages allowed (from App.jsx)
    return children;
  }
  else if (authed === true && currentUser.role !== "admin") {             // [Authorization] If user is logged in but is not admin, redirect to homepage
    return <Navigate to="/" />
  }
  else {                                                                  // [Authorization] If user is not logged in, redirect to login page
    console.log("go login");
    return <Navigate to="/login" />
  }

}
