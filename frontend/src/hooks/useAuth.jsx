import {createContext, useContext, useState} from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authed, setAuthed] = useState(false);
    
  const login = () => {
      return new Promise((res) => {
        setAuthed(true);
        res();
      });
    }
    const logout = () => {
      return new Promise((res) => {
        setAuthed(false);
        res();
      });
    }
  

  return (<AuthContext.Provider value={{authed, currentUser, login, logout}}>{children}</AuthContext.Provider>
  
  );
}


export function RequireAuth({ children }) {
    const { authed } = useAuth();
    const location = useLocation();
  
    return authed === true ? children : <Navigate to="/login" replace state={{ path: location.pathname }}/>;
  }