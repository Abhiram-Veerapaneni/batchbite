function BatchCard({ batch, onAssign }) {
    return (
        <div className="batch-item">

            <div className="batch-main">

                <div className="zones">

                    <h3>{batch.restaurantZone.name}</h3>

                    <span className="arrow">
                        →
                    </span>

                    <h3>{batch.deliveryZone.name}</h3>

                </div>

                <div className="batch-meta">

                    <span>
                        📦 {batch.orderCount}/{batch.threshold} Orders
                    </span>

                    <span>
                        🚚 {batch.agent?.name || "Not Assigned"}
                    </span>

                </div>

            </div>

            <div className="batch-actions">

                <span className={`status ${batch.status}`}>
                    {batch.status.replaceAll("_", " ")}
                </span>

                {
                    !batch.agent &&
                    batch.status === "pending" &&

                    <button
                        className="assign-btn"
                        onClick={onAssign}
                    >
                        Assign
                    </button>
                }

            </div>

        </div>
    );
}

export default BatchCard;