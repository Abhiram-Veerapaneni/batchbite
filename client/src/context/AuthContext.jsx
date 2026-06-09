import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

// Create context (global auth store)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user from backend (/me)
  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data); // store user globally
    } catch (error) {
      setUser(null); // not logged in
    } finally {
      setLoading(false);
    }
  };


  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  // Run once when app loads
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};