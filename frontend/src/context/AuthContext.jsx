import { createContext, useState, useEffect, useContext } from "react";

import { CartContext } from "./CartContext";
import { getCurrentAccount, logoutAccount } from "../services/authService";

// Create context (global auth store)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState("");

  const [loading, setLoading] = useState(true);

  const { fetchCart } = useContext(CartContext);

  // Fetch logged-in account from backend (/me)
  const fetchAccount = async () => {
    try {

      const data = await getCurrentAccount();

      // store account globally
      setAccount(data.account);
      setAccountType(data.accountType);

      // to load cart right after account logs in (cart sync)
      if (data.accountType === "student") fetchCart();

    } catch (error) {

      setAccount(null); // not logged in

    } finally {

      setLoading(false);

    }
  };


  const refreshAccount = async () => {
    try {

      const data = await getCurrentAccount();

      setAccount(data.account);
      setAccountType(data.accountType);

    } catch (err) {

      setAccount(null);

    }
  };

  const logout = async () => {
    try {

      await logoutAccount();   // call backend logout route

    } catch (err) {

      console.error(err);

    } finally {
      setAccount(null);
      setAccountType("");

    }
  };

  // Run once when app loads
  useEffect(() => {

    fetchAccount();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        account,
        accountType,
        setAccount,
        loading,
        refreshAccount,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};