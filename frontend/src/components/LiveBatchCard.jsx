import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { formatTime } from "../utils/timeUtils";

const API_URL = import.meta.env.VITE_API_URL;

function LiveBatchCard() {

    const [batchData, setBatchData] = useState(null);

    const fetchBatchGroups = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/batch-groups/live`,
                {
                    withCredentials: true
                }
            );
            console.log(res.data);

            setBatchData(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchBatchGroups();

        const interval = setInterval(
            fetchBatchGroups,
            5000
        );

        return () => clearInterval(interval);

    }, []);

    if (!batchData) {
        return null;
    }

    if(batchData.batchGroups.length == 0) return null;

    return (
        <div className="live-batches-card">

            <div className="live-batch-header">

                <span className="live-batch-title">

                    {batchData.isCurrent
                        ? "🔥 Current Slot"
                        : "⏳ Next Slot"}

                </span>

                <Link
                    to="/slots"
                    className="view-slots-link"
                >
                    View all →
                </Link>

            </div>

            <div className="batch-slot-time">

                {formatTime(batchData.slot.startTime)}
                {" - "}
                {formatTime(batchData.slot.endTime)}

            </div>

            {batchData.batchGroups.length === 0 ? (

                <div className="empty-batch-state">

                    No active batches yet.
                    Be the first student to join!

                </div>

            ) : (

                batchData.batchGroups.map((batchGroup) => {

                    const joined = Math.min(
                        batchGroup.totalOrders,
                        batchGroup.threshold
                    );

                    const percentage = Math.min(
                        (joined / batchGroup.threshold) * 100,
                        100
                    );

                    return (

                        <div
                            key={batchGroup._id}
                            className="batch-group-item"
                        >

                            <div className="batch-group-top">

                                <div className="batch-group-zone">
                                    {batchGroup.restaurantZone?.name}
                                </div>

                                <div className="batch-group-count">
                                    {joined}/{batchGroup.threshold}
                                </div>

                            </div>

                            <div className="live-batch-progress">

                                <div
                                    className="live-batch-progress-fill"
                                    style={{
                                        width: `${percentage}%`
                                    }}
                                />

                            </div>

                        </div>

                    );

                })

            )}

        </div>
    )

}

export default LiveBatchCard;