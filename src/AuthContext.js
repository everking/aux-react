// AuthContext.js
import React, { createContext, useContext, useState } from "react";
import firebaseAuth from "./firebaseAuth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (email, password) => {
    const response = await firebaseAuth.login(email, password);
    if (response.idToken) {
      setCurrentUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } else {
      throw new Error(response.error.message);
    }
  };

  const signup = async (email, password) => {
    const response = await firebaseAuth.signUp(email, password);
    if (response.idToken) {
      setCurrentUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } else {
      throw new Error(response.error.message);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}