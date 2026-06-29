import { FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";

function AgentCard({
    agent,
    onEdit,
    onDelete
}) {

    return (

        <div className="agent-card">

            <div className="agent-left">

                <div className="agent-top">

                    <div>

                        <h2 className="agent-name">
                            {agent.name}
                        </h2>

                        <div className="agent-phone">
                            📞 {agent.phone}
                        </div>

                    </div>

                    <div className={`agent-status ${agent.status}`}>
                        {agent.status.replace("_", " ")}
                    </div>

                </div>

                <div className="agent-zone-section">

                    <div className="agent-section-title">
                        Working Zones
                    </div>

                    <div className="agent-zone-list">

                        {
                            agent.zones.length ?

                                agent.zones.map(zone => (

                                    <span
                                        key={zone}
                                        className="agent-zone-chip"
                                    >
                                        {zone}
                                    </span>

                                ))

                                :

                                <span className="agent-no-batch">
                                    No zones assigned
                                </span>

                        }

                    </div>

                </div>

                <div className="agent-zone-section">

                    <div className="agent-section-title">
                        Current Batch
                    </div>

                    {

                        agent.currentBatch ?

                            <div className="agent-batch">

                                <div className="agent-zone">

                                    <div className="agent-zone-label">
                                        Restaurant Zone
                                    </div>

                                    <div className="agent-zone-name">
                                        {agent.currentBatch.restaurantZone?.name}
                                    </div>

                                </div>

                                <FaArrowRight className="agent-arrow" />

                                <div className="agent-zone">

                                    <div className="agent-zone-label">
                                        Delivery Zone
                                    </div>

                                    <div className="agent-zone-name">
                                        {agent.currentBatch.deliveryZone?.name}
                                    </div>

                                </div>

                            </div>

                            :

                            <div className="agent-no-batch">
                                No Active Batch
                            </div>

                    }

                </div>

            </div>

            <div className="agent-right">

                <button
                    className="agent-edit-btn"
                    onClick={onEdit}
                >
                    <FaEdit />
                    {" "}
                    Edit
                </button>

                <button
                    className="agent-delete-btn"
                    onClick={() => onDelete(agent)}
                >
                    <FaTrash />
                    {" "}
                    Delete
                </button>

            </div>

        </div>

    );

}

export default AgentCard;