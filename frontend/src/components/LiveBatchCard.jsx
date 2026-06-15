import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { formatTime } from "../utils/timeUtils";

const API_URL = import.meta.env.VITE_API_URL;

function LiveBatchCard() {

    const [batchSlot, setBatchSlot] = useState(null);

    const fetchBatch = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/slots`
            );

            const slots = res.data;

            const now = new Date();

            // Current live batch
            const currentSlot = slots.find(
                (slot) =>
                    new Date(slot.startTime) <= now &&
                    now < new Date(slot.endTime)
            );

            if (currentSlot) {
                setBatchSlot({
                    ...currentSlot,
                    isLive: true
                });

                return;
            }

            // Next upcoming batch
            const nextSlot = slots.find(
                (slot) =>
                    new Date(slot.startTime) > now
            );

            if (nextSlot) {

                setBatchSlot({
                    ...nextSlot,
                    isLive: false
                });

            } else {

                setBatchSlot(null);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchBatch();

        const interval = setInterval(
            fetchBatch,
            5000
        );

        return () => clearInterval(interval);

    }, []);

    if (!batchSlot) {
        return null;
    }

    const joined = Math.min(
        batchSlot.totalOrders,
        batchSlot.threshold
    );

    const percentage = Math.min(
        (joined / batchSlot.threshold) * 100,
        100
    );

    return (

        <div className="live-batch-card">

            <div className="live-batch-header">

                <span className="live-batch-title">

                    {batchSlot.isLive
                        ? "🔥 Live Batch"
                        : "🚚 Next Delivery Batch"
                    }

                </span>

                <Link
                    to="/slots"
                    className="view-slots-link"
                >
                    View all →
                </Link>

            </div>

            <div className="live-batch-time">

                {formatTime(batchSlot.startTime)}
                {" - "}
                {formatTime(batchSlot.endTime)}

            </div>

            <div className="live-batch-count">

                👥 {joined}/
                {batchSlot.threshold}
                {" "}students joined

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

}

export default LiveBatchCard;