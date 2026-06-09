import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <p>Welcome: {user?.name}</p>
      <p>Role: {user?.role}</p>
      <p>University: {user?.university}</p>
    </div>
  );
}

export default Dashboard;