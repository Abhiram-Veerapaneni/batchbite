import { createContext, useState, useEffect } from "react";
import { getCurrentAgent, logoutAgent } from "../agent/services/agentService.js";

// Create context (global auth store)
export const AgentAuthContext = createContext();

export const AgentAuthProvider = ({ children }) => {

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch logged-in agent from backend (/me)
  const fetchAgent = async () => {
    try {
      const data = await getCurrentAgent();

      setAgent(data); // store agent globally

    } catch (error) {

      setAgent(null); // not logged in

    } finally {
      setLoading(false);
    }
  };


  const refreshAgent = async () => {
    try {
      const data = await getCurrentAgent();
      setAgent(data);
    } catch (err) {
      setAgent(null);
    }
  };

  const logout = async () => {
    try {
      await logoutAgent();   // call backend logout route
    } catch (err) {
      console.error(err);
    } finally {
      setAgent(null);
    }
  };

  // Run once when app loads
  useEffect(() => {
    fetchAgent();
  }, []);

  return (
    <AgentAuthContext.Provider
      value={{
        agent,
        setAgent,
        loading,
        refreshAgent,
        logout
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  );
};