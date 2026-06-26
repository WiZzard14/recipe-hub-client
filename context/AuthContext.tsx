"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  isLoggedIn: false, 
  setIsLoggedIn: () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Shudhu isLoggedIn state rakhlam, isMounted baad!
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
    // Ekta choto function toiri kore tar vitore state update korlam
    // jate linter ar complain na kore
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn");
      if (loggedInStatus === "true") {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);