"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userImage: string | null;
  login: (image: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  isLoggedIn: false, 
  userImage: null,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn");
      const savedImage = localStorage.getItem("userImage");
      
      if (loggedInStatus === "true") {
        setIsLoggedIn(true);
        if (savedImage) setUserImage(savedImage);
      }
    };
    checkLoginStatus();
  }, []);

  const login = (image: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userImage", image);
    setIsLoggedIn(true);
    setUserImage(image);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userImage");
    setIsLoggedIn(false);
    setUserImage(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userImage, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);