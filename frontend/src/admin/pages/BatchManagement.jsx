import { useEffect, useMemo, useState } from "react";

import BatchCard from "../components/BatchCard";
import AssignAgentModal from "../components/AssignAgentModal";

import { getAllBatches } from "../services/batchService";

const statusOptions = [
    ["all", "All Status"],
    ["pending", "Pending"],
    ["assigned", "Assigned"],
    ["out_for_delivery", "Out For Delivery"],
    ["delivered", "Delivered"]
];

const assignmentOptions = [
    ["all", "All"],
    ["assigned", "Assigned"],
    ["unassigned", "Unassigned"]
];

const orderOptions = [
    ["all", "All Orders"],
    ["0-5", "0 - 5"],
    ["6-10", "6 - 10"],
    ["11-20", "11 - 20"],
    ["20+", "20+"]
];

const sortOptions = [
    ["newest", "Newest"],
    ["oldest", "Oldest"],
    ["highest", "Highest Orders"],
    ["lowest", "Lowest Orders"]
];

const renderOptions = (options) =>
    options.map(([value, label]) => (
        <option key={value} value={value}>
            {label}
        </option>
    ));

function BatchManagement() {

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [assignmentFilter, setAssignmentFilter] = useState("all");
    const [orderFilter, setOrderFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {

        try {

            setLoading(true);

            const data = await getAllBatches();

            setBatches(data);

        }
        catch (err) {

            console.log(err);

        }
        finally {

            setLoading(false);

        }

    };

    const filteredBatches = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        const orderRanges = {
            "0-5": count => count <= 5,
            "6-10": count => count >= 6 && count <= 10,
            "11-20": count => count >= 11 && count <= 20,
            "20+": count => count > 20
        };

        const sorters = {
            newest: (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt),

            oldest: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),

            highest: (a, b) =>
                b.orderCount - a.orderCount,

            lowest: (a, b) =>
                a.orderCount - b.orderCount
        };

        return [...batches]

            .filter(batch => {

                if (!keyword) return true;

                return [
                    batch.restaurantZone?.name,
                    batch.deliveryZone?.name,
                    batch.agent?.name
                ]
                    .filter(Boolean)
                    .some(text =>
                        text.toLowerCase().includes(keyword)
                    );

            })

            .filter(batch =>
                statusFilter === "all" ||
                batch.status === statusFilter
            )

            .filter(batch =>
                assignmentFilter === "all" ||
                (assignmentFilter === "assigned"
                    ? batch.agent
                    : !batch.agent)
            )

            .filter(batch =>
                orderFilter === "all" ||
                orderRanges[orderFilter](batch.orderCount)
            )

            .sort(sorters[sortBy]);

    }, [
        batches,
        search,
        statusFilter,
        assignmentFilter,
        orderFilter,
        sortBy
    ]);

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="batch-page">

            <div className="batch-page-header">

                <h1 className="batch-page-title">
                    Batch Management
                </h1>

                <span className="batch-page-count">
                    {filteredBatches.length} Batch(es)
                </span>

            </div>

            <div className="batch-filter-bar">

                <input
                    className="batch-search"
                    type="text"
                    placeholder="Search restaurant, delivery zone or agent..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="batch-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    {renderOptions(statusOptions)}
                </select>

                <select
                    className="batch-select"
                    value={assignmentFilter}
                    onChange={e => setAssignmentFilter(e.target.value)}
                >
                    {renderOptions(assignmentOptions)}
                </select>

                <select
                    className="batch-select"
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value)}
                >
                    {renderOptions(orderOptions)}
                </select>

                <select
                    className="batch-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                >
                    {renderOptions(sortOptions)}
                </select>

            </div>

            <div className="batch-list">

                {
                    filteredBatches.length ? (

                        filteredBatches.map(batch => (

                            <BatchCard
                                key={batch._id}
                                batch={batch}
                                onAssign={() => setSelectedBatch(batch)}
                            />

                        ))

                    ) : (

                        <div className="batch-empty">
                            No batches found.
                        </div>

                    )
                }

            </div>

            {
                selectedBatch && (

                    <AssignAgentModal
                        batch={selectedBatch}
                        onClose={() => setSelectedBatch(null)}
                        onAssigned={() => {

                            fetchBatches();
                            setSelectedBatch(null);

                        }}
                    />

                )
            }

        </div>

    );

}

export default BatchManagement;