function UserDetailsModal({ user, onClose }) {

    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className="modal-header">
                    <h2>{user.name}</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">

                    <p><strong>Email:</strong> {user.email}</p>

                    <p><strong>Role:</strong> {user.role}</p>

                    <p><strong>University:</strong> {user.university}</p>

                    <p>
                        <strong>Address:</strong>{" "}
                        {user.address?.addressLine}
                    </p>

                    <p>
                        <strong>Region:</strong>{" "}
                        {user.address?.zone}
                    </p>

                    <p>
                        <strong>Pincode:</strong>{" "}
                        {user.address?.pincode}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {user.isActive ? "Active" : "Inactive"}
                    </p>

                </div>

            </div>
        </div>
    );
}

export default UserDetailsModal;