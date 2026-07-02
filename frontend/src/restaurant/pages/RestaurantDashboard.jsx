import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { getTodaysOrders } from "../services/RestaurantServices";
import { getDeliveryZones } from "../services/OtherServices";

import "../styles/RestaurantDashboard.css";
import { formatTime } from "../../utils/timeUtils";

const batchStatusOptions = [
    ["all", "All"],
    ["pending", "Pending"],
    ["shifted", "Shifted"],
    ["batched", "batched"]
]

const deliveryStatusOptions = [
    ["all", "All"],
    ["waiting", "Waiting"],
    ["out_for_delivery", "Out for delivery"],
    ["delivered", "Delivered"]
]

const sortOptions = [
    ["newest", "Newest"],
    ["oldest", "Oldest"],
];

const renderOptions = (options) =>
    options.map(([value, label]) => (
        <option key={value} value={value}>
            {label}
        </option>
    ));

function RestaurantDashboard() {

    const { account } = useContext(AuthContext);

    const [todaysOrders, setTodaysOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [batchStatusFilter, setBatchStatusFilter] = useState("all");
    const [deliveryStatusFilter, setdeliveryStatusFilter] = useState("all");
    const [deliveryZoneFilter, setDeliveryZoneFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [deliveryZoneOptions, setDeliveryZoneOptions] = useState([
        ["all", "All"]
    ]);

    const fetchTodaysOrders = async () => {

        try {

            const orders = await getTodaysOrders();
            setTodaysOrders(orders);
            setLoading(false);

        } catch (error) {

            console.error(error?.message || "Failed to fetch Today's Orders");
            toast.error(error?.message || "Failed to fetch Today's Orders");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchZones = async () => {
            const zones = await getDeliveryZones();

            setDeliveryZoneOptions([
                ["all", "All"],
                ...zones.map(zone => [zone._id, zone.name])
            ]);
        };

        fetchZones();
    }, []);

    useEffect(() => {

        fetchTodaysOrders()

    }, []);

    const filteredOrders = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        const sorters = {
            newest: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
            oldest: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        }

        return [...todaysOrders]
            // search
            .filter(order => {

                if (!keyword) return true;

                const itemNames = order.items.map(item => item.name).join(" ")
                return [
                    order.user?.name,
                    order.user?.email,
                    order.user?.university,
                    order.deliveryZone?.name,
                    itemNames
                ]
                    .filter(Boolean)
                    .some(text =>
                        text.toLowerCase().includes(keyword)
                    )
            })
            // status
            .filter(order =>
                batchStatusFilter === "all" || order.batchStatus === batchStatusFilter
            )
            .filter(order =>
                deliveryStatusFilter === "all" || order.deliveryStatus === deliveryStatusFilter
            )
            .filter(order =>
                deliveryZoneFilter === "all" ||
                order.deliveryZone?._id === deliveryZoneFilter
            )
            .sort(sorters[sortBy])
    }, [
        todaysOrders,
        search,
        batchStatusFilter,
        deliveryStatusFilter,
        sortBy
    ])

    if (loading) {
        return (
            <div className="rd-dashboard">

                <div className="rd-header">

                    <div>
                        <div className="rd-skeleton rd-skeleton-title"></div>
                        <div className="rd-skeleton rd-skeleton-subtitle"></div>
                    </div>

                    <div className="rd-skeleton rd-skeleton-count"></div>

                </div>

                <div className="rd-filters">

                    <div className="rd-skeleton rd-skeleton-input"></div>
                    <div className="rd-skeleton rd-skeleton-input"></div>
                    <div className="rd-skeleton rd-skeleton-input"></div>
                    <div className="rd-skeleton rd-skeleton-input"></div>
                    <div className="rd-skeleton rd-skeleton-input"></div>

                </div>

                <div className="rd-orders">

                    {[...Array(5)].map((_, index) => (

                        <div
                            key={index}
                            className="rd-loading-card"
                        >

                            <div className="rd-skeleton rd-skeleton-name"></div>

                            <div className="rd-skeleton rd-skeleton-items"></div>

                            <div className="rd-skeleton rd-skeleton-small"></div>

                            <div className="rd-skeleton rd-skeleton-small"></div>

                            <div className="rd-skeleton rd-skeleton-badge"></div>

                            <div className="rd-skeleton rd-skeleton-badge"></div>

                            <div className="rd-skeleton rd-skeleton-small"></div>

                        </div>

                    ))}

                </div>

            </div>
        );
    }

    return (
        <div className="rd-dashboard">

            <div className="rd-header">

                <div className="rd-header-left">

                    <h1 className="rd-title">
                        Restaurant Dashboard
                    </h1>

                    <p className="rd-subtitle">
                        Welcome, {account.name}
                    </p>

                </div>

                <div className="rd-header-right">

                    <div className="rd-count-card">

                        <div className="rd-count-number">
                            {filteredOrders.length}
                        </div>

                        <div className="rd-count-label">
                            Today's Orders
                        </div>

                    </div>

                </div>

            </div>

            <div className="rd-filters">

                <input
                    className="rd-search"
                    type="text"
                    placeholder="Search student, email, item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="rd-select"
                    value={batchStatusFilter}
                    onChange={(e) =>
                        setBatchStatusFilter(e.target.value)
                    }
                >
                    {renderOptions(batchStatusOptions)}
                </select>

                <select
                    className="rd-select"
                    value={deliveryStatusFilter}
                    onChange={(e) =>
                        setdeliveryStatusFilter(e.target.value)
                    }
                >
                    {renderOptions(deliveryStatusOptions)}
                </select>

                <select
                    className="rd-select"
                    value={deliveryZoneFilter}
                    onChange={(e) =>
                        setDeliveryZoneFilter(e.target.value)
                    }
                >
                    {renderOptions(deliveryZoneOptions)}
                </select>

                <select
                    className="rd-select"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >
                    {renderOptions(sortOptions)}
                </select>

            </div>

            <div className="rd-orders">

                {filteredOrders.length === 0 ? (

                    <div className="rd-empty">
                        No orders found.
                    </div>

                ) : (

                    filteredOrders.map(order => (

                        <div
                            key={order._id}
                            className="rd-order-card"
                        >

                            <div className="rd-student">

                                <h3 className="rd-student-name">
                                    {order.user.name}
                                </h3>

                                <p className="rd-student-email">
                                    {order.user.email}
                                </p>

                            </div>

                            <div className="rd-items">

                                {order.items.map(item => (

                                    <div
                                        key={item.itemId}
                                        className="rd-item"
                                    >

                                        <span className="rd-item-name">
                                            {item.name}
                                        </span>

                                        <span className="rd-item-qty">
                                            × {item.quantity}
                                        </span>

                                        <span className="rd-item-price">
                                            {item.price * item.quantity}
                                        </span>

                                    </div>

                                ))}

                            </div>

                            <div className="rd-amount">
                                ₹{order.totalAmount}
                            </div>

                            <div className="rd-zone">
                                {order.deliveryZone?.name}
                            </div>

                            <div
                                className={`rd-batch-status rd-${order.batchStatus}`}
                            >
                                {order.batchStatus.replace("_", " ")}
                            </div>

                            <div
                                className={`rd-delivery-status rd-${order.deliveryStatus.replaceAll("_", "-")}`}
                            >
                                {order.deliveryStatus.replaceAll("_", " ")}
                            </div>

                            <div className="rd-time">
                                🕒 {formatTime(order.createdAt)}
                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default RestaurantDashboard;