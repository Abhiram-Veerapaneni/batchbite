import { useEffect, useState } from "react";
import { getCurrentBatch } from "../services/agentService";
import { pickUpBatch, deliverBatch } from "../services/agentService";

function Dashboard() {

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
        } finally {
            setLoading(false);
        }
    };

    const handlePickUp = async () => {
        await pickUpBatch(batch._id);
        fetchBatch();
    };

    const handleDeliver = async () => {
        await deliverBatch(batch._id);
        fetchBatch();
    };

    if (loading) return <h2>Loading...</h2>;

    if (!batch) return <h2>No Active Batch</h2>;

    return (
        <div>
            <h2>Current Batch</h2>

            <p>
                {batch.restaurantZone?.name} → {batch.deliveryZone?.name}
            </p>

            <p>Status: {batch.status}</p>

            <p>Orders: {batch.orderCount}</p>

            {batch.status === "assigned" && (
                <button onClick={handlePickUp}>
                    Pick Up Batch
                </button>
            )}

            {batch.status === "out_for_delivery" && (
                <button onClick={handleDeliver}>
                    Mark Delivered
                </button>
            )}
        </div>
    );
}

export default Dashboard;