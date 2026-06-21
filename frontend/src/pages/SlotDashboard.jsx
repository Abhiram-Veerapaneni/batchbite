import axios from "axios";
import { useEffect, useState } from "react";

import { formatTime } from "../utils/timeUtils";

const API_URL = import.meta.env.VITE_API_URL;

function SlotDashboard() {

    const [batchGroups, setBatchGroups] = useState([]);

    const fetchBatchGroups = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/batch-groups/current`,
                {
                    withCredentials: true
                }
            );

            setBatchGroups(res.data);

        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {

        fetchBatchGroups();

        const interval = setInterval(
            fetchBatchGroups,
            10000
        );

        return () => clearInterval(interval);

    }, []);

    const isCurrentSlot = (slot) => {

        const now = new Date();

        return (
            new Date(slot.startTime) <= now &&
            now < new Date(slot.endTime)
        );

    };

    const groupedSlots = batchGroups.reduce((acc, batch) => {

        const slotId = batch.slot._id;

        if (!acc[slotId]) {

            acc[slotId] = {
                slot: batch.slot,
                batches: []
            };

        }

        acc[slotId].batches.push(batch);

        return acc;

    }, {});

    return (

        <div className="slot-dashboard">

            {Object.values(groupedSlots).length === 0 ? (

                <div className="slot-card">
                    <p>No active batch groups</p>
                </div>

            ) : (

                Object.values(groupedSlots).map(
                    ({ slot, batches }) => (

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

                            {batches.map((batch) => {

                                const percentage = Math.min(
                                    (batch.totalOrders /
                                        batch.threshold) *
                                    100,
                                    100
                                );

                                const ordersLeft = Math.max(
                                    batch.threshold -
                                    batch.totalOrders,
                                    0
                                );

                                return (

                                    <div
                                        key={batch._id}
                                        className="region-section"
                                    >

                                        <h4>
                                            {
                                                batch.restaurantZone
                                                    ?.name
                                            }
                                        </h4>

                                        <div className="slot-stats">

                                            <span>
                                                {
                                                    batch.totalOrders
                                                }
                                                /
                                                {
                                                    batch.threshold
                                                }
                                                {" "}Orders
                                            </span>

                                            <span>
                                                {
                                                    ordersLeft > 0
                                                        ? `Need ${ordersLeft} more`
                                                        : "Full"
                                                }
                                            </span>

                                        </div>

                                        <div className="progress-bar">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${percentage}%`
                                                }}
                                            />

                                        </div>

                                        <div className="progress-text">

                                            {
                                                percentage.toFixed(
                                                    0
                                                )
                                            }
                                            % Filled

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )
                )

            )}

        </div>

    );

}

export default SlotDashboard;