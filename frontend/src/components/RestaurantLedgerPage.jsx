import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    getRestaurantLedgers,
    settleRestaurantLedger
} from "../services/OtherServices.js";

import LedgerCard from "./LedgerCard";

import "../styles/RestaurantLedgerPage.css";

const statusOptions = [
    ["all", "All"],
    ["pending", "Pending"],
    ["receivable", "Receivable"],
    ["settled", "Settled"],
    ["cancelled", "Cancelled"]
];

const sortOptions = [
    ["newest", "Newest"],
    ["oldest", "Oldest"]
];

const renderOptions = (options) =>
    options.map(([value, label]) => (
        <option key={value} value={value}>
            {label}
        </option>
    ));

function RestaurantLedgerPage({ isAdmin = false }) {
    const [loading, setLoading] = useState(true);
    const [ledgers, setLedgers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const fetchLedgers = async () => {
        try {
            const { ledgers } = await getRestaurantLedgers();
            setLedgers(ledgers);
        } catch (error) {
            toast.error(error?.message || "Failed to load ledgers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedgers();
    }, []);

    const summary = useMemo(() => {
        const totals = {
            pending: 0,
            receivable: 0,
            settled: 0,
            cancelled: 0
        };

        ledgers.forEach(({ status, netAmount }) => {
            if (totals[status] !== undefined) {
                totals[status] += netAmount;
            }
        });

        return {
            ...totals,
            total: Object.values(totals).reduce(
                (sum, amount) => sum + amount,
                0
            )
        };
    }, [ledgers]);

    const filteredLedgers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        const sorter =
            sortBy === "newest"
                ? (a, b) =>
                      new Date(b.createdAt) - new Date(a.createdAt)
                : (a, b) =>
                      new Date(a.createdAt) - new Date(b.createdAt);

        return ledgers
            .filter((ledger) => {
                if (
                    statusFilter !== "all" &&
                    ledger.status !== statusFilter
                ) {
                    return false;
                }

                if (!keyword) return true;

                return [
                    ledger.orderId?._id,
                    ledger.userId?.name,
                    ledger.userId?.email,
                    ledger.settlementReference
                ]
                    .filter(Boolean)
                    .some((value) =>
                        value.toLowerCase().includes(keyword)
                    );
            })
            .sort(sorter);
    }, [ledgers, search, statusFilter, sortBy]);

    const handleSettle = async (ledgerId) => {
        try {
            await settleRestaurantLedger(ledgerId);
            toast.success("Settlement completed.");
            fetchLedgers();
        } catch (error) {
            toast.error(
                error?.message || "Failed to settle ledger."
            );
        }
    };

        if (loading) {
        return (
            <div className="ledger-loading">
                Loading ledgers...
            </div>
        );
    }

    return (

        <div className="ledger-page">

            <div className="ledger-header">

                <div>

                    <h1 className="ledger-title">
                        {isAdmin ? "Restaurant Ledgers" : "My Ledgers"}
                    </h1>

                    <p className="ledger-subtitle">
                        Track restaurant settlements and payouts.
                    </p>

                </div>

            </div>

            <div className="ledger-summary">

                <div className="ledger-summary-card">
                    <span className="ledger-summary-label">
                        Pending
                    </span>
                    <h2>₹{summary.pending}</h2>
                </div>

                <div className="ledger-summary-card">
                    <span className="ledger-summary-label">
                        Receivable
                    </span>
                    <h2>₹{summary.receivable}</h2>
                </div>

                <div className="ledger-summary-card">
                    <span className="ledger-summary-label">
                        Settled
                    </span>
                    <h2>₹{summary.settled}</h2>
                </div>

                <div className="ledger-summary-card">
                    <span className="ledger-summary-label">
                        Total
                    </span>
                    <h2>₹{summary.total}</h2>
                </div>

            </div>

            <div className="ledger-filters">

                <input
                    className="ledger-search"
                    type="text"
                    placeholder="Search order, user..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="ledger-select"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    {renderOptions(statusOptions)}
                </select>

                <select
                    className="ledger-select"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >
                    {renderOptions(sortOptions)}
                </select>

                <span className="ledger-count">
                    {filteredLedgers.length} record
                    {filteredLedgers.length !== 1 && "s"}
                </span>

            </div>

            <div className="ledger-list">

                {filteredLedgers.length === 0 ? (

                    <div className="ledger-empty">
                        No ledgers found.
                    </div>

                ) : (

                    filteredLedgers.map(ledger => (

                        <LedgerCard
                            key={ledger._id}
                            ledger={ledger}
                            isAdmin={isAdmin}
                            onSettle={handleSettle}
                        />

                    ))

                )}

            </div>

        </div>

    );

}

export default RestaurantLedgerPage;