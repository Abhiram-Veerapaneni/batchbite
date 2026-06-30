import { useEffect, useState } from "react";
import { getDeliveryHistory } from "../services/agentService";

function DeliveryHistory() {

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getDeliveryHistory();
            setBatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dh-loading">
                Loading...
            </div>
        );
    }

    return (
        <div className="dh-page">

            <div className="dh-header">
                <h1>Delivery History</h1>
                <span className="dh-count">
                    {batches.length} Deliveries
                </span>
            </div>

            {batches.length === 0 ? (
                <div className="dh-empty">
                    <h2>No Deliveries Yet</h2>
                    <p>Your completed deliveries will appear here.</p>
                </div>
            ) : (
                <div className="dh-list">

                    {batches.map(batch => (
                        <div
                            key={batch._id}
                            className="dh-card"
                        >

                            <div className="dh-card-header">

                                <h3>
                                    {batch.restaurantZone?.name}
                                    {" → "}
                                    {batch.deliveryZone?.name}
                                </h3>

                                <span className="dh-status">
                                    Delivered
                                </span>

                            </div>

                            <div className="dh-details">

                                <div className="dh-row">
                                    <span className="dh-label">
                                        Orders
                                    </span>

                                    <span>
                                        {batch.orderCount}
                                    </span>
                                </div>

                                <div className="dh-row">
                                    <span className="dh-label">
                                        Delivered On
                                    </span>

                                    <span>
                                        {new Date(batch.updatedAt).toLocaleString()}
                                    </span>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default DeliveryHistory;