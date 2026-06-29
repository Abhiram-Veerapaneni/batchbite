import { createContext, useState, useEffect, useContext } from "react";


// Create context (global auth store)
export const AgentAuthContext = createContext();

export const AgentAuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetchCart } = useContext(CartContext);
  
  // Fetch logged-in user from backend (/me)
  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data); // store user globally

      // to load cart right after user logs in (cart sync)
      fetchCart();

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

  const logout = async () => {
    try {
      await logoutUser();   // call backend logout route
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  // Run once when app loads
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AgentAuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser,
        logout
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  );
};