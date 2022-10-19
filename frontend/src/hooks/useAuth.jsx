import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/accounts";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {


  const [currentUser, setCurrentUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
    if (sessionStorage.getItem("authed") == "true"){
      setAuthed(true)
      const user = JSON.parse(sessionStorage.getItem("currentUser"))
      if (user)
        setCurrentUser(user)
    }
  },[])

  const authRegister = async (userForm) => {
    setAuthMsg("");
    try {
      const verifyUser = await authService.register(userForm);
      console.log(verifyUser);
      setCurrentUser(verifyUser);
      // navigate("/login2FA"); <- CHANGE TO GO TO HOMEPAGE STRAIGHT RMB CHANGE BACK 
      sessionStorage.setItem("authed", true)//delete later!!
      sessionStorage.setItem("currentUser", JSON.stringify(verifyUser))//delete later!!
      navigate("/");//delete later!!
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
      setCurrentUser(verifyUser);
      // navigate("/login2FA"); <- CHANGE TO GO TO HOMEPAGE STRAIGHT RMB CHANGE BACK 
      setAuthed(true); //delete later!!
      sessionStorage.setItem("authed", true) //delete later!
      sessionStorage.setItem("currentUser", JSON.stringify(verifyUser)) // delete later!
      navigate("/"); //delete later!!
      
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
      sessionStorage.setItem("authed", true)
      sessionStorage.setItem("currentUser", JSON.stringify(verifyUser))
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function RequireAuth({ children }) {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
