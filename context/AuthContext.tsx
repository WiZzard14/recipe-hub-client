"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const checkUserLoggedIn = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { 
          credentials: "include" 
        });
        
        if (isMounted.current) {
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted.current) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkUserLoggedIn();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};