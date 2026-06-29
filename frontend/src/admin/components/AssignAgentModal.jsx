import { useEffect, useState } from "react";
import { getAvailableAgents } from "../services/agentService";
import { assignBatch } from "../services/batchService";
import toast from "react-hot-toast/headless";

function AssignAgentModal({
    batch,
    onClose,
    onAssigned
}) {

    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState("");

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {

        try {

            const data = await getAvailableAgents();
            setAgents(data);
        } catch (error) {

        }
    }

    const handleAssign = async () => {

        console.log("Clicked")

        if (!selectedAgent) {

            toast.error("Select an agent");
            return;
        }

        try {

            await assignBatch(batch._id, selectedAgent)

            onAssigned();
            onClose();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>Assign Agent</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    <p>

                        Assign an agent for

                        <strong>
                            {" "}
                            {batch.restaurantZone?.name}
                        </strong>

                    </p>

                    <select
                        value={selectedAgent}
                        onChange={(e) =>
                            setSelectedAgent(e.target.value)
                        }
                    >

                        <option value="">
                            Select Agent
                        </option>

                        {agents.map(agent => (
                            <option
                                key={agent._id}
                                value={agent._id}
                            >
                                {agent.name}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="modal-footer">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="assign-btn"
                        onClick={handleAssign}
                    >
                        Assign
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AssignAgentModal