import { useEffect, useMemo, useState } from "react";
import { deleteAgent, getAllAgents } from "../services/agentService";
import AgentCard from "../components/AgentCard";
import AgentFormModal from "../components/AgentFormModal";

const API_URL = import.meta.env.VITE_API_URL;

function AgentManagement() {

    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [zoneFilter, setRegionFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchAgents();
    }, [])

    const fetchAgents = async () => {

        try {
            setLoading(true);
            const data = await getAllAgents();
            setAgents(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const zoneOptions = useMemo(() => {

        const zones = new Set();
        agents.forEach(agent => {
            agent.zones.forEach(zone => {
                zones.add(zone)
            })
        })

        return [...zones].sort();
    }, [agents]);

    const filteredAgents = useMemo(() => {

        let data = [...agents];

        if (search.trim()) {

            const keyword = search.toLowerCase();

            data = data.filter(agent => {

                const name = agent.name.toLowerCase();
                const phone = agent.phone.toLowerCase();
                const zone = agent.zones.join(" ").toLowerCase();

                return (
                    name.includes(keyword) ||
                    phone.includes(keyword) ||
                    zone.includes(keyword)
                );
            })
        }

        if (statusFilter !== "all") {

            data = data.filter(agent => agent.status === statusFilter)
        }

        if (zoneFilter !== "all") {

            data = data.filter(agent =>
                agent.zones.includes(zoneFilter)
            )
        }

        switch (sortBy) {

            case "newest":
                data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                break;
            case "oldest":
                data.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                )
                break;
            case "name":
                data.sort(
                    (a, b) => a.name.localeComapare(b.name)
                )
                break;
            case "available":
                data.sort((a, b) => {

                    if (a.status === b.status) return 0;
                    if (a.status === "available") return -1;
                    if (b.status === "available") return 1;

                    return 0;
                })
                break;
            default:
                break;
        }
        return data;
    }, [
        agents,
        search,
        statusFilter,
        zoneFilter,
        sortBy
    ])

    if (loading) {
        return (
            <div className="agent-loading">
                Loading....
            </div>
        )
    }

    return (

        <div className="agent-page">

            <div className="agent-page-header">

                <div>
                    <h1 className="agent-page-title">
                        Agent Management
                    </h1>

                    <p className="agent-page-subtitle">
                        Manage delivery partners
                    </p>
                </div>

                <button
                    className="agent-add-btn"
                    onClick={() => {

                        setSelectedAgent(null);
                        setShowModal(true);

                    }}
                >

                    + Add Agent

                </button>

            </div>

            <div className="agent-filter-bar">

                <input
                    className="agent-search"
                    type="text"
                    placeholder="Search name, phone or zone..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="agent-select"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="all">

                        All Status

                    </option>

                    <option value="available">

                        Available

                    </option>

                    <option value="busy">

                        Busy

                    </option>

                    <option value="offline">

                        Offline

                    </option>

                </select>

                <select
                    className="agent-select"
                    value={zoneFilter}
                    onChange={(e) =>
                        setRegionFilter(e.target.value)
                    }
                >

                    <option value="all">

                        All Zones

                    </option>

                    {

                        zoneOptions.map(zone => (

                            <option
                                key={zone}
                                value={zone}
                            >

                                {zone}

                            </option>

                        ))

                    }

                </select>

                <select
                    className="agent-select"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >

                    <option value="newest">

                        Newest

                    </option>

                    <option value="oldest">

                        Oldest

                    </option>

                    <option value="name">

                        Name A-Z

                    </option>

                    <option value="available">

                        Available First

                    </option>

                </select>

            </div>

            <div className="agent-list">

                {

                    filteredAgents.length ?

                        (

                            filteredAgents.map(agent => (

                                <AgentCard

                                    key={agent._id}
                                    agent={agent}

                                    onEdit={() => {

                                        setSelectedAgent(agent);
                                        setShowModal(true);

                                    }}

                                    onDelete={(agent) => {
                                        deleteAgent(agent._id)
                                        fetchAgents;
                                    }}

                                />

                            ))

                        )

                        :

                        (

                            <div className="agent-empty">

                                No agents found.

                            </div>

                        )

                }

            </div>

            {

                showModal && (

                    <AgentFormModal

                        agent={selectedAgent}

                        onClose={() =>
                            setShowModal(false)
                        }

                        onSaved={() => {

                            fetchAgents();
                            setShowModal(false);

                        }}

                    />

                )

            }

        </div>

    );

}

export default AgentManagement;