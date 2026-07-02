import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getRestaurantOrderHistory } from "../services/RestaurantServices";
import { getDeliveryZones, getSlots } from "../services/OtherServices";

import "../styles/Orders.css";
import { formatTime } from "../../utils/timeUtils";
import OrderHistoryCard from "../components/OrderHistoryCard";

const deliveryStatusOptions = [
    ["all", "All"],
    ["delivered", "Delivered"],
    ["cancelled", "Cancelled"]
];

const sortOptions = [
    ["newest", "Newest"],
    ["oldest", "Oldest"],
    ["amount-high", "Highest Amount"],
    ["amount-low", "Lowest Amount"]
];

const renderOptions = (options) =>
    options.map(([value, label]) => (
        <option
            key={value}
            value={value}
        >
            {label}
        </option>
    ));

function RestaurantOrderHistory() {

    const [orders, setOrders] = useState([]);

    const [summary, setSummary] = useState({
        deliveredOrders: 0,
        deliveredAmount: 0,
        cancelledOrders: 0,
        cancelledAmount: 0
    });

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
    const [deliveryZoneFilter, setDeliveryZoneFilter] = useState("all");
    const [slotFilter, setSlotFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [deliveryZoneOptions, setDeliveryZoneOptions] = useState([
        ["all", "All"]
    ]);

    const [slotOptions, setSlotOptions] = useState([
        ["all", "All"]
    ]);

    const fetchOrderHistory = async () => {

        try {

            const data = await getRestaurantOrderHistory();

            setOrders(data.totalOrders);

            setSummary({
                deliveredOrders: data.deliveredOrders,
                deliveredAmount: data.deliveredAmount,
                cancelledOrders: data.cancelledOrders,
                cancelledAmount: data.cancelledAmount
            });

        } catch (error) {

            console.error(error);
            toast.error(
                error?.message ||
                "Failed to fetch order history."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchOrderHistory();

    }, []);

    useEffect(() => {

        const fetchFilters = async () => {

            try {

                const [zones, slots] = await Promise.all([
                    getDeliveryZones(),
                    getSlots()
                ]);

                setDeliveryZoneOptions([
                    ["all", "All"],
                    ...zones.map(zone => [
                        zone._id,
                        zone.name
                    ])
                ]);

                setSlotOptions([
                    ["all", "All"],
                    ...slots.map(slot => [
                        `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
                        `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
                    ])
                ]);

            } catch (error) {

                console.error(error);

            }

        };

        fetchFilters();

    }, []);

    const filteredOrders = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        const sorters = {

            newest: (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt),

            oldest: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),

            "amount-high": (a, b) =>
                b.totalAmount - a.totalAmount,

            "amount-low": (a, b) =>
                a.totalAmount - b.totalAmount

        };

        return [...orders]

            .filter(order => {

                if (!keyword) return true;

                const itemNames = order.items
                    .map(item => item.name)
                    .join(" ");

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
                    );

            })

            .filter(order =>
                deliveryStatusFilter === "all" ||
                order.deliveryStatus === deliveryStatusFilter
            )

            .filter(order =>
                deliveryZoneFilter === "all" ||
                order.deliveryZone?._id === deliveryZoneFilter
            )

            .filter(order =>
                slotFilter === "all" ||
                order.slot?._id === slotFilter
            )

            .sort(sorters[sortBy]);

    }, [
        orders,
        search,
        deliveryStatusFilter,
        deliveryZoneFilter,
        slotFilter,
        sortBy
    ]);

        return (

        <div className="res-orders-page">

            <div className="res-orders-header">

                <div>

                    <h1 className="res-orders-title">
                        Order History
                    </h1>

                    <p className="res-orders-subtitle">
                        Delivered and cancelled orders
                    </p>

                </div>

                <div className="res-orders-summary">

                    <div className="res-orders-summary-card">

                        <span className="res-orders-summary-label">
                            Delivered
                        </span>

                        <h2 className="res-orders-summary-count">
                            {summary.deliveredOrders}
                        </h2>

                        <span className="res-orders-summary-amount">
                            ₹{summary.deliveredAmount}
                        </span>

                    </div>

                    <div className="res-orders-summary-card res-orders-summary-cancelled">

                        <span className="res-orders-summary-label">
                            Cancelled
                        </span>

                        <h2 className="res-orders-summary-count">
                            {summary.cancelledOrders}
                        </h2>

                        <span className="res-orders-summary-amount">
                            ₹{summary.cancelledAmount}
                        </span>

                    </div>

                </div>

            </div>

            <div className="res-orders-toolbar">

                <input
                    type="text"
                    className="res-orders-search"
                    placeholder="Search student, item..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="res-orders-select"
                    value={slotFilter}
                    onChange={(e) =>
                        setSlotFilter(e.target.value)
                    }
                >
                    {renderOptions(slotOptions)}
                </select>

                <select
                    className="res-orders-select"
                    value={deliveryStatusFilter}
                    onChange={(e) =>
                        setDeliveryStatusFilter(e.target.value)
                    }
                >
                    {renderOptions(deliveryStatusOptions)}
                </select>

                <select
                    className="res-orders-select"
                    value={deliveryZoneFilter}
                    onChange={(e) =>
                        setDeliveryZoneFilter(e.target.value)
                    }
                >
                    {renderOptions(deliveryZoneOptions)}
                </select>

                <select
                    className="res-orders-select"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >
                    {renderOptions(sortOptions)}
                </select>

                <div className="res-orders-filter-count">

                    {filteredOrders.length}

                    <span>
                        {" "}
                        Orders
                    </span>

                </div>

            </div>

            <div className="res-orders-list">
                                {loading ? (

                    <div className="res-orders-loading">

                        {Array.from({ length: 6 }).map((_, index) => (

                            <div
                                key={index}
                                className="res-orders-loading-card"
                            />

                        ))}

                    </div>

                ) : filteredOrders.length === 0 ? (

                    <div className="res-orders-empty">

                        <h3>No orders found</h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                ) : (

                    filteredOrders.map(order => (

                        <OrderHistoryCard key = {order._id} order={order}/>

                    ))

                )}

            </div>

        </div>

    );

}

export default RestaurantOrderHistory;