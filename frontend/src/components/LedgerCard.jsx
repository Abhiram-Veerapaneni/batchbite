import toast from "react-hot-toast";

function LedgerCard({ ledger, isAdmin, onSettle }) {
    
    const {
        _id,
        userId,
        orderId,
        grossAmount,
        platformFee,
        deliveryFee,
        netAmount,
        status,
        createdAt,
        settledAt,
        settlementReference
    } = ledger;

    const createdDate = new Date(createdAt);
    const settledDate = settledAt ? new Date(settledAt) : null;

    const handleSettle = async () => {
        try {
            await onSettle(_id);
        } catch (error) {
            toast.error(error?.message || "Failed to settle ledger.");
        }
    };

    return (
        <div className="ledger-card">
            <div className="ledger-left">
                <h3 className="ledger-user-name">{userId?.name}</h3>
                <p className="ledger-user-email">{userId?.email}</p>
                <p className="ledger-order">
                    Order #{orderId.slice(-8).toUpperCase()}
                </p>
            </div>

            <div className="ledger-center">
                <div className="ledger-row">
                    <span>Gross Amount</span>
                    <strong>₹{grossAmount}</strong>
                </div>

                <div className="ledger-row">
                    <span>Platform Fee</span>
                    <strong>-₹{platformFee}</strong>
                </div>

                <div className="ledger-row">
                    <span>Delivery Fee</span>
                    <strong>-₹{deliveryFee}</strong>
                </div>

                <div className="ledger-row ledger-net">
                    <span>Net Amount</span>
                    <strong>₹{netAmount}</strong>
                </div>
            </div>

            <div className="ledger-right">
                <span className={`ledger-status ledger-status-${status}`}>
                    {status}
                </span>

                <span className="ledger-date">
                    {createdDate.toLocaleDateString()}
                    {" • "}
                    {createdDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </span>

                {settlementReference && (
                    <span className="ledger-reference">
                        {settlementReference}
                    </span>
                )}

                {settledDate && (
                    <span className="ledger-date">
                        Settled {settledDate.toLocaleDateString()}
                    </span>
                )}

                {isAdmin && status === "receivable" && (
                    <button
                        className="ledger-settle-btn"
                        onClick={handleSettle}
                    >
                        Settle
                    </button>
                )}
            </div>
        </div>
    );
}

export default LedgerCard;