import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import UserDetailsModal from "../components/UserDetailsModal";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function UserManagement() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/admin/users`,
                {
                    withCredentials: true
                }
            )
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div>
            <h1>User Dashboard</h1>

            {users.length === 0 && (
                <p>No users found</p>
            )}

            <div className="user-grid">
                {users.map(user => (
                    <UserCard
                        key={user._id}
                        user={user}
                        onClick={setSelectedUser}
                    />
                ))}
            </div>

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}

export default UserManagement;