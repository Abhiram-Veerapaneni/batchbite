import { useEffect, useState } from "react";
import {
    getCurrentBatch,
    pickUpBatch,
    deliverBatch
} from "../services/agentService";

import toast from "react-hot-toast";

function AgentDashboard() {

    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBatch();
    }, []);

    const fetchBatch = async () => {
        try {
            const data = await getCurrentBatch();
            setBatch(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load batch");
        } finally {
            setLoading(false);
        }
    };

    const handlePickUp = async () => {
        try {
            await pickUpBatch(batch._id);
            toast.success("Batch picked up");
            fetchBatch();
        } catch (err) {
            toast.error("Failed to pick up batch");
        }
    };

    const handleDeliver = async () => {
        try {
            await deliverBatch(batch._id);
            toast.success("Batch delivered");
            fetchBatch();
        } catch (err) {
            toast.error("Failed to deliver batch");
        }
    };

    if (loading) {
        return (
            <div className="ad-loading">
                Loading...
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="ad-empty">
                <h2>No Active Batch</h2>
                <p>You don't have any assigned batch right now.</p>
            </div>
        );
    }

    return (
        <div className="ad-page">

            <div className="ad-card">

                <div className="ad-header">
                    <h2>Current Batch</h2>

                    <span className={`ad-status ad-status-${batch.status}`}>
                        {batch.status.replaceAll("_", " ")}
                    </span>
                </div>

                <div className="ad-details">

                    <div className="ad-row">
                        <span className="ad-label">Restaurant Zone</span>
                        <span>{batch.restaurantZone?.name}</span>
                    </div>

                    <div className="ad-row">
                        <span className="ad-label">Delivery Zone</span>
                        <span>{batch.deliveryZone?.name}</span>
                    </div>

                    <div className="ad-row">
                        <span className="ad-label">Orders</span>
                        <span>{batch.orderCount}</span>
                    </div>

                </div>

                <div className="ad-actions">

                    {batch.status === "assigned" && (
                        <button
                            className="ad-btn ad-btn-pickup"
                            onClick={handlePickUp}
                        >
                            Pick Up Batch
                        </button>
                    )}

                    {batch.status === "out_for_delivery" && (
                        <button
                            className="ad-btn ad-btn-delivered"
                            onClick={handleDeliver}
                        >
                            Mark Delivered
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

export default AgentDashboard;