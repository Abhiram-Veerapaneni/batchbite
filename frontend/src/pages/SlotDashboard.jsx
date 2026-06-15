import axios from "axios";
import { useEffect, useState } from "react";

import { formatTime } from "../utils/timeUtils";

const API_URL = import.meta.env.VITE_API_URL;

function SlotDashboard() {

    const [slots, setSlots] = useState([]);

    const fetchSlots = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/slots`
            );

            setSlots(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    // Auto refresh every 5 seconds
    useEffect(() => {

        fetchSlots();
        const interval = setInterval(
            fetchSlots,
            5000
        );
        return () => clearInterval(interval);

    }, []);

    // Check if the slot is currently active
    const isCurrentSlot = (slot) => {

        const now = new Date();
        return (
            new Date(slot.startTime) <= now &&
            now < new Date(slot.endTime)
        );
    };

    return (

        <div className="slot-dashboard">

            {slots.map((slot) => {

                const percentage = Math.min(
                    (slot.totalOrders / slot.threshold) * 100,
                    100
                );

                const ordersLeft = Math.max(
                    slot.threshold - slot.totalOrders,
                    0
                );

                return (

                    <div
                        key={slot._id}
                        className={
                            isCurrentSlot(slot)
                                ? "slot-card active-slot"
                                : "slot-card"
                        }
                    >

                        <h2>
                            {formatTime(slot.startTime)}
                            {" - "}
                            {formatTime(slot.endTime)}
                        </h2>

                        {isCurrentSlot(slot) && (

                            <div className="slot-status">
                                🔥 Live Batch
                            </div>

                        )}

                        <div className="slot-stats">

                            <span className="orders-count">

                                {slot.totalOrders}
                                /
                                {slot.threshold}
                                {" "}Orders

                            </span>

                            <span className="remaining-orders">

                                {ordersLeft > 0
                                    ? `${ordersLeft} left`
                                    : "Full"
                                }

                            </span>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${percentage}%`
                                }}
                            />

                        </div>

                        <div className="progress-text">

                            {percentage.toFixed(0)}% Filled

                        </div>

                    </div>

                );

            })}

        </div>

    );

}

export default SlotDashboard;