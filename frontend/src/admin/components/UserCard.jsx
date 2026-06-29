function UserCard({ user, onClick }) {
    return (
        <div className="user-card" onClick={() => onClick(user)}>
            <h3>{user.name}</h3>
            <p>{user.role}</p>
            <p>{user.address?.zone}</p>
            <p>{user.email}</p>
        </div>
    );
}

export default UserCard;